"use client"

import React, { useCallback, useEffect, useRef, useState } from "react";
import MapCanvas from "../../components/map/MapCanvas";
import BinMarkers from "../../components/map/BinMarkers";
import LocateMeControl from "../../components/map/LocateMeControl";
import AddBinControl from "../../components/map/AddBinControl";
import FilterControl from "../../components/map/FilterControl";
import type { Bin } from "../../components/map/types";
import { useMap } from "../../components/map/MapContext";

export default function MapPage() {

	// whether the user has been prompted for location and their choice resolved
	const [locationPromptVisible, setLocationPromptVisible] = useState(true);
	const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [locationConsentResolved, setLocationConsentResolved] = useState(false);
	const [toastMessage, setToastMessage] = useState<string | null>(null);
	const toastTimerRef = useRef<number | null>(null);
	const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
	const locationPrimaryRef = useRef<HTMLButtonElement | null>(null);

	// autofocus the primary action when the prompt opens
	useEffect(() => {
		if (locationPromptVisible && locationPrimaryRef.current) {
			locationPrimaryRef.current.focus();
		}
	}, [locationPromptVisible]);

	// Open directions for selected bin in Google Maps (new tab)
	const openDirections = React.useCallback(() => {
		if (!selectedBin || !selectedBin.coordinates) return;
		const { lat, lng } = selectedBin.coordinates;
		const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(lat + "," + lng)}&travelmode=walking`;
		window.open(url, "_blank", "noopener,noreferrer");
	}, [selectedBin]);

		const [viewport, setViewport] = useState<{
			center: [number, number];
			bounds?: unknown;
			zoom: number;
		} | null>(null);
		const [visibleTypes, setVisibleTypes] = useState<Bin["type"][]>(["recycle", "compost", "landfill"]);

		// user-created / local bins
		const [userBins, setUserBins] = useState<Bin[]>([
			{
				binId: "local-uuid",
				type: "recycle",
				coordinates: { lat: 51.0486, lng: -114.0708 },
				address: "123 7 Ave SW, Calgary",
				fullnessLevel: 0.32,
				accessibility: ["wheelchair-accessible"],
				city: "Calgary",
				createdAt: 1731038400000,
				createdBy: "user-123",
				lastCheckedAt: 1731042000000,
				status: "active",
			},
		]);

		// bins fetched from OSM/Overpass
		const [osmBins, setOsmBins] = useState<Bin[]>([]);
		const abortRef = useRef<AbortController | null>(null);
		const debounceRef = useRef<number | null>(null);

	const handleAdd = useCallback((draft: Partial<Bin>) => {
		const newBin: Bin = {
			binId: String(Date.now()),
			type: draft.type ?? "landfill",
			coordinates: draft.coordinates ?? { lat: 51.0486, lng: -114.0708 },
			address: draft.address,
			fullnessLevel: draft.fullnessLevel,
			accessibility: draft.accessibility,
			city: draft.city,
			createdAt: Date.now(),
			createdBy: "local",
			lastCheckedAt: draft.lastCheckedAt,
			status: draft.status ?? "active",
		};
		setUserBins((b) => [newBin, ...b]);
	}, []);

	// Compute distance (meters) between two lat/lng points (Haversine)
	const haversineMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
		const R = 6371000; // meters
		const toRad = (d: number) => (d * Math.PI) / 180;
		const dLat = toRad(lat2 - lat1);
		const dLon = toRad(lon2 - lon1);
		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	};

	// When viewport changes, fetch nearby bins from our server proxy (/api/bins)
useEffect(() => {
 		if (!viewport) return;
 		// don't fetch until the user has accepted/denied the location prompt
 		if (!locationConsentResolved) return;

		// Debounce rapid moves
		if (debounceRef.current) {
			window.clearTimeout(debounceRef.current);
		}
		debounceRef.current = window.setTimeout(() => {
			// Abort previous
			if (abortRef.current) abortRef.current.abort();
			const ac = new AbortController();
			abortRef.current = ac;

			const [lng, lat] = [viewport.center[0], viewport.center[1]];
			// compute radius as half of diagonal of bounds if available, otherwise 1000m
			let radiusMeters = 1000;
			try {
				if (viewport.bounds) {
					// bounds may be LngLatBoundsLike: array [[west,south],[east,north]] or an object with accessor methods
					let north = 0,
						south = 0,
						east = 0,
						west = 0;
					if (Array.isArray(viewport.bounds)) {
						const b0 = viewport.bounds[0] as [number, number];
						const b1 = viewport.bounds[1] as [number, number];
						west = b0[0];
						south = b0[1];
						east = b1[0];
						north = b1[1];
					} else {
						// typed accessor detection
						type BoundsWithMethods = { getNorth?: () => number; getSouth?: () => number; getEast?: () => number; getWest?: () => number };
						const b = viewport.bounds as BoundsWithMethods;
						if (typeof b.getNorth === "function") {
							north = b.getNorth!();
							south = b.getSouth!();
							east = b.getEast!();
							west = b.getWest!();
						}
					}
					const diagonal = haversineMeters(south, west, north, east);
					radiusMeters = Math.max(200, diagonal / 2);
				}
			} catch {
				radiusMeters = 1000;
			}

				// Cap radius to server-supported MAX (keep in sync with server MAX_RADIUS)
				// Increased to allow city-wide queries; note large radii can be slow.
				const CLIENT_MAX_RADIUS = 50000; // meters
				let radiusToSend = Math.round(radiusMeters);
				if (radiusToSend > CLIENT_MAX_RADIUS) {
					// show a short-lived, non-blocking toast instead of console.info
					setToastMessage(`Search radius capped to ${CLIENT_MAX_RADIUS} m — zoom in to load more results`);
					if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
					toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 3500);
					radiusToSend = CLIENT_MAX_RADIUS;
				}
				const q = new URLSearchParams({ lat: String(lat), lng: String(lng), radius: String(radiusToSend), limit: "500" });
				fetch(`/api/bins?${q.toString()}`, { signal: ac.signal })
				.then(async (r) => {
					if (!r.ok) {
						console.warn("/api/bins returned", r.status);
						return;
					}
					const json = await r.json();
					if (!json?.features || !Array.isArray(json.features)) return;

					// Map GeoJSON features to our Bin type
					type GeoFeature = { geometry?: { coordinates?: number[] } | null; properties?: { tags?: Record<string, string>; id?: number; osm_type?: string } };
					const mapped: Bin[] = (json.features as GeoFeature[])
						.map((f) => {
							const coords = f.geometry?.coordinates;
							if (!coords || coords.length < 2) return null;
							const tags = f.properties?.tags ?? {};
							// heuristic map of OSM amenity tags to our bin types
							const amenity = (tags?.amenity ?? "").toLowerCase();
							let type: Bin["type"] = "landfill";
							if (amenity.includes("recycle") || amenity.includes("recycling")) type = "recycle";
							else if (amenity.includes("compost")) type = "compost";

							const addressParts = [] as string[];
							if (tags["addr:housenumber"]) addressParts.push(tags["addr:housenumber"]);
							if (tags["addr:street"]) addressParts.push(tags["addr:street"]);
							if (tags["addr:city"]) addressParts.push(tags["addr:city"]);

							const address = addressParts.length ? addressParts.join(" ") : tags.name ?? undefined;

							const bin: Bin = {
								binId: `${f.properties?.osm_type ?? "osm"}/${f.properties?.id ?? Math.random()}`,
								type,
								coordinates: { lat: coords[1]!, lng: coords[0]! },
								address,
								fullnessLevel: undefined,
								accessibility: tags.wheelchair ? [tags.wheelchair] : undefined,
								city: tags["addr:city"] ?? undefined,
								status: "active",
							};
							return bin;
						})
						.filter((b): b is Bin => !!b);

					setOsmBins(mapped);
				})
				.catch((err) => {
					if (err.name === "AbortError") return;
					console.error("fetch /api/bins failed", err);
				});
		}, 300);

		return () => {
			if (debounceRef.current) window.clearTimeout(debounceRef.current);
		};
	}, [viewport, locationConsentResolved]);

	// small helper child component that recenters the map when we obtain a user location
	function ApplyUserLocation({ loc }: { loc: { lat: number; lng: number } | null }) {
		const { map, ready } = useMap();
		const prevRef = useRef<{ lat: number; lng: number } | null>(null);
		useEffect(() => {
			if (!ready || !map || !loc) return;
			// only apply easing when the location actually changed to avoid loops
			if (prevRef.current && prevRef.current.lat === loc.lat && prevRef.current.lng === loc.lng) return;
			try {
				map.easeTo({ center: [loc.lng, loc.lat], zoom: 14 });
				prevRef.current = loc;
			} catch {
				// ignore
			}
		}, [ready, map, loc]);
		return null;
	}

	return (
		<div style={{ width: "100%", height: "100vh" }}>
			<div style={{ display: "flex", height: "100%" }}>
				<aside style={{ width: 320, padding: 18, borderRight: "1px solid rgba(0,0,0,0.06)", boxSizing: "border-box", background: "#fafafa" }}>
					<h2 style={{ margin: 0, fontSize: 20 }}>WasteWiser Map</h2>
					<p style={{ marginTop: 8, marginBottom: 12, color: "#444", fontSize: 13 }}>Click a bin on the map to view its address and details. Use the Directions button to open navigation (coming soon).</p>

					{!selectedBin ? (
						<div style={{ marginTop: 12, color: "#333" }}>
							<h3 style={{ marginTop: 0, fontSize: 15 }}>How to use</h3>
							<ol style={{ paddingLeft: 18 }}>
								<li>Pan / zoom the map to your area.</li>
								<li>Click a bin marker (grey circle) to see its address and tags.</li>
								<li>Press Directions to get navigation (not implemented yet).</li>
							</ol>
						</div>
					) : (
						<div style={{ marginTop: 12 }}>
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
								<div>
									<h3 style={{ margin: 0, fontSize: 16 }}>Bin details</h3>
									<div style={{ marginTop: 8, color: "#333" }}>
										<div style={{ fontSize: 14, fontWeight: 600 }}>{selectedBin.type.toUpperCase()}</div>
										<div style={{ marginTop: 6 }}>{selectedBin.address ?? "No address available"}</div>
										{selectedBin.city ? <div style={{ color: "#666", marginTop: 6 }}>{selectedBin.city}</div> : null}
									</div>
								</div>
								<button onClick={() => setSelectedBin(null)} aria-label="Close" style={{ border: "none", background: "transparent", fontSize: 18, cursor: "pointer" }}>✕</button>
							</div>

							<div style={{ marginTop: 16 }}>
								<button onClick={openDirections} style={{ background: "#0ea5e9", color: "white", border: "none", padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Open directions</button>
							</div>
						</div>
					)}
				</aside>

				<div style={{ flex: 1, position: "relative" }}>
					<MapCanvas onViewport={(v) => setViewport(v)}>
						{/* apply user location when available */}
						{userLocation ? <ApplyUserLocation loc={userLocation} /> : null}
						<FilterControl visibleTypes={visibleTypes} onChange={setVisibleTypes} />
						<LocateMeControl />
						<AddBinControl onAdd={handleAdd} />
						<BinMarkers bins={[...userBins, ...osmBins]} visibleTypes={visibleTypes} onBinClick={(b) => setSelectedBin(b)} />
					</MapCanvas>
				</div>
			</div>

			{/* Location prompt overlay - ask user for permission before fetching bins */}
			{locationPromptVisible && (
				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby="location-dialog-title"
					aria-describedby="location-dialog-desc"
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							setLocationPromptVisible(false);
							setLocationConsentResolved(true);
						}
					}}
					style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
					{/* backdrop */}
					<div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(3px)" }} />
					<div style={{ position: "relative", pointerEvents: "auto", background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", maxWidth: 520, width: "min(92%,520px)" }}>
						<header style={{ display: "flex", gap: 12, alignItems: "center" }}>
							<div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,#06b6d4,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22 }} aria-hidden>
								📍
							</div>
							<div>
								<h3 id="location-dialog-title" style={{ margin: 0, fontSize: 18 }}>Allow location access</h3>
								<p id="location-dialog-desc" style={{ margin: 0, color: "#444", marginTop: 6 }}>We can use your device location to show nearby waste bins. This improves relevance and speeds up results. You can change this later in your browser settings.</p>
							</div>
						</header>
						<div style={{ display: "flex", gap: 12, marginTop: 18, justifyContent: "flex-end" }}>
							<button
								ref={locationPrimaryRef}
								onClick={() => {
									if (!("geolocation" in navigator)) {
										setLocationPromptVisible(false);
										setLocationConsentResolved(true);
										return;
									}
									navigator.geolocation.getCurrentPosition((pos) => {
										const { latitude, longitude } = pos.coords;
										setUserLocation({ lat: latitude, lng: longitude });
										setLocationPromptVisible(false);
										setLocationConsentResolved(true);
									}, (err) => {
										console.warn("geolocation failed", err);
										setLocationPromptVisible(false);
										setLocationConsentResolved(true);
									}, { enableHighAccuracy: true, timeout: 5000 });
								}}
								style={{ background: "#0ea5e9", color: "white", border: "none", padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
							>
								Use my location
							</button>
							<button
								onClick={() => { setLocationPromptVisible(false); setLocationConsentResolved(true); }}
								style={{ background: "transparent", color: "#374151", border: "1px solid #e5e7eb", padding: "10px 14px", borderRadius: 8, cursor: "pointer" }}
							>
								Continue without
							</button>
						</div>
					</div>
				</div>
			)}

			{toastMessage && (
				<div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 24, zIndex: 80 }}>
					<div style={{ background: "rgba(0,0,0,0.85)", color: "#fff", padding: "8px 12px", borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.25)", fontSize: 13 }}>
						{toastMessage}
					</div>
				</div>
			)}
		</div>
	);
}
