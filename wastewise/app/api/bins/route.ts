import { NextResponse } from "next/server";

// Simple in-memory cache to avoid hammering Overpass for identical queries.
// This is per-instance and will be reset when the server restarts.
type CacheEntry = { ts: number; body: unknown };
const CACHE_TTL = 60 * 1000; // 60s
const cache = new Map<string, CacheEntry>();

// Limits to keep Overpass queries reasonable. Increased to allow city-wide
// queries (Calgary ~ 30-40km across) — note: larger values may lead to
// slower Overpass responses or timeouts depending on the mirror.
const MAX_RADIUS = 50000; // meters (50 km)
const DEFAULT_LIMIT = 500;
const FETCH_TIMEOUT_MS = 15000; // server-side fetch timeout (ms)

// This route queries OpenStreetMap via the Overpass API for nearby bin-like
// features and returns a GeoJSON FeatureCollection. It applies a radius cap,
// a short fetch timeout, and a small in-memory cache to improve responsiveness.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const lat = params.get("lat");
  const lng = params.get("lng");
  const radiusRaw = Number(params.get("radius") ?? "1000"); // meters
  const limitRaw = Number(params.get("limit") ?? String(DEFAULT_LIMIT));

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat & lng required" }, { status: 400 });
  }

  const radius = Math.max(0, Math.min(MAX_RADIUS, Math.floor(radiusRaw)));
  const limit = Math.max(1, Math.min(2000, Math.floor(limitRaw)));

  // If the caller explicitly requested a radius larger than our allowed maximum,
  // return a clear 400 response rather than attempting an expensive Overpass
  // query that is likely to time out. The client should reduce the radius and
  // retry (or the UI can request paging/tiling instead).
  if (radiusRaw > MAX_RADIUS) {
    const metaTooLarge = { radius_requested: radiusRaw, max_radius: MAX_RADIUS };
    return NextResponse.json(
      { error: "radius_too_large", message: `radius must be <= ${MAX_RADIUS} meters`, meta: metaTooLarge },
      { status: 400 }
    );
  }

  const cacheKey = `${lat}:${lng}:${radius}:${limit}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && now - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.body);
  }

  const OVERPASS_ENDPOINT = process.env.OVERPASS_ENDPOINT ?? "https://overpass-api.de/api/interpreter";

  // Common OSM tags for bins / litter receptacles. We use a regex match on the
  // `amenity` tag to capture several variants. This can be extended later.
  const amenityTags = [
    "bin",
    "litter_bin",
    "waste_bin",
    "waste_basket",
    "trash_bin",
    "garbage_bin",
    "litter",
  ];
  const amenityRegex = amenityTags.join("|");

  // Build an Overpass QL query that finds nodes/ways/relations with matching
  // amenity tags within the radius. Use a modest Overpass timeout to avoid
  // extremely long-running queries. We'll slice to `limit` in JS as before.
  const query = `
[out:json][timeout:25];
(
  node["amenity"~"${amenityRegex}"](around:${radius},${lat},${lng});
  way["amenity"~"${amenityRegex}"](around:${radius},${lat},${lng});
  relation["amenity"~"${amenityRegex}"](around:${radius},${lat},${lng});
);
out center;`;

  // Short-circuit: Overpass can be slow for large radii. Informationally include
  // whether the radius was capped in the response payload.
  const meta: Record<string, unknown> = { radius_requested: radiusRaw, radius_used: radius };

  // Use AbortController to enforce a server-side fetch timeout
  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(OVERPASS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain; charset=utf-8", Accept: "application/json" },
      body: query,
      signal: ac.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "overpass error", detail: text, meta }, { status: 502 });
    }

    const data = await res.json();
    type OverpassElement = {
      id: number;
      type: "node" | "way" | "relation";
      lat?: number;
      lon?: number;
      center?: { lat: number; lon: number };
      bounds?: { minlat?: number; maxlat?: number; minlon?: number; maxlon?: number };
      tags?: Record<string, string>;
    };

    const elements: OverpassElement[] = Array.isArray(data.elements) ? data.elements : [];

    const features = elements
      .slice(0, Math.max(0, limit))
      .map((el) => {
        let longitude: number | null = null;
        let latitude: number | null = null;

        if (el.type === "node") {
          latitude = typeof el.lat === "number" ? el.lat : null;
          longitude = typeof el.lon === "number" ? el.lon : null;
        } else if (el.type === "way" || el.type === "relation") {
          if (el.center && typeof el.center.lat === "number" && typeof el.center.lon === "number") {
            latitude = el.center.lat;
            longitude = el.center.lon;
          } else if (el.bounds) {
            // Fallback: average bounds if available
            const minlat = Number(el.bounds?.minlat ?? NaN);
            const maxlat = Number(el.bounds?.maxlat ?? NaN);
            const minlon = Number(el.bounds?.minlon ?? NaN);
            const maxlon = Number(el.bounds?.maxlon ?? NaN);
            if (Number.isFinite(minlat) && Number.isFinite(maxlat) && Number.isFinite(minlon) && Number.isFinite(maxlon)) {
              latitude = (minlat + maxlat) / 2;
              longitude = (minlon + maxlon) / 2;
            }
          }
        }

        const properties = {
          id: el.id,
          osm_type: el.type,
          tags: el.tags ?? {},
        };

        return {
          type: "Feature",
          geometry: latitude !== null && longitude !== null ? { type: "Point", coordinates: [longitude, latitude] } : null,
          properties,
        };
      })
      // Filter out features without geometry
      .filter((f) => f.geometry !== null);

    const body = { type: "FeatureCollection", features, meta };
    cache.set(cacheKey, { ts: Date.now(), body });
    return NextResponse.json(body);
  } catch (err: unknown) {
    clearTimeout(timeout);
    // Distinguish an abort timeout from other errors
  if ((err as { name?: string })?.name === "AbortError") {
      return NextResponse.json({ error: "overpass timeout", detail: "request timed out", meta }, { status: 504 });
    }
    return NextResponse.json({ error: "fetch failed", detail: String(err), meta }, { status: 500 });
  }
}
