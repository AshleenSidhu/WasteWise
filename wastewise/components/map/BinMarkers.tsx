"use client"

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useMap } from "./MapContext";
import type { Bin } from "./types";

// small helper to escape HTML inserted into popups
function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Props = {
  bins: Bin[];
  visibleTypes?: Bin["type"][];
  onBinClick?: (b: Bin) => void;
};

const SOURCE_ID = "ww-bins-source";
const LAYER_CLUSTER = "ww-bins-clusters";
const LAYER_CLUSTER_COUNT = "ww-bins-cluster-count";
const LAYER_UNCLUSTERED = "ww-bins-unclustered";

export default function BinMarkers({ bins, visibleTypes = ["recycle", "compost", "landfill"], onBinClick }: Props) {
  const { map, ready } = useMap();
  const binsRef = useRef<Bin[]>(bins);
  const onBinClickRef = useRef<typeof onBinClick | undefined>(onBinClick);
  // keep refs up to date so click handlers (attached once) use latest values
  useEffect(() => {
    binsRef.current = bins;
  }, [bins]);
  useEffect(() => {
    onBinClickRef.current = onBinClick;
  }, [onBinClick]);

  useEffect(() => {
    if (!ready || !map) return;

    const popupRef = { current: null as mapboxgl.Popup | null };
    // Ensure source exists (create if missing)
    if (!map.getSource(SOURCE_ID)) {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 14,
      });
    }

    // Cluster circle layer
    if (!map.getLayer(LAYER_CLUSTER)) {
      map.addLayer({
        id: LAYER_CLUSTER,
        type: "circle",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            10,
            "#f1f075",
            50,
            "#f28cb1",
          ],
          "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 50, 25],
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });
    }

    // Cluster count label
    if (!map.getLayer(LAYER_CLUSTER_COUNT)) {
      map.addLayer({
        id: LAYER_CLUSTER_COUNT,
        type: "symbol",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#000",
        },
      });
    }

    // Unclustered point layer
    if (!map.getLayer(LAYER_UNCLUSTERED)) {
      map.addLayer({
        id: LAYER_UNCLUSTERED,
        type: "circle",
        source: SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": ["case", ["==", ["get", "type"], "recycle"], "#0077cc", ["==", ["get", "type"], "compost"], "#2e7d32", "#666"],
          "circle-radius": 9,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });
    }

    // styling for popups is provided via global CSS (app/globals.css) under
    // the `.ww-bin-popup` class; avoid injecting styles at runtime.

    // Generic click handler: check cluster first, then unclustered
  const onMapClick = (e: mapboxgl.MapMouseEvent) => {
      try {
        const clusterFeatures = map.queryRenderedFeatures(e.point, { layers: [LAYER_CLUSTER] });
        if (clusterFeatures && clusterFeatures.length > 0) {
          const cluster = clusterFeatures[0];
          const clusterIdRaw = cluster.properties && (cluster.properties as Record<string, unknown>)["cluster_id"];
          const clusterId = typeof clusterIdRaw === "number" ? clusterIdRaw : typeof clusterIdRaw === "string" ? Number(clusterIdRaw) : undefined;
          if (typeof clusterId !== "undefined" && !Number.isNaN(clusterId)) {
            const src = map.getSource(SOURCE_ID) as (mapboxgl.GeoJSONSource & {
              getClusterExpansionZoom?: (id: number, cb: (err: Error | null, zoom: number) => void) => void;
            }) | undefined;
            const geo = (cluster.geometry as unknown) as GeoJSON.Point | undefined;
            const coords = geo?.coordinates as [number, number] | undefined;
            if (src && typeof src.getClusterExpansionZoom === "function" && coords) {
              try {
                src.getClusterExpansionZoom(clusterId, (err: Error | null, zoom: number) => {
                  if (err) return;
                  map.easeTo({ center: coords as [number, number], zoom: zoom + 1 });
                });
              } catch {}
            }
            return;
          }
        }

        // no cluster, check unclustered
        const features = map.queryRenderedFeatures(e.point, { layers: [LAYER_UNCLUSTERED] });
        if (!features || features.length === 0) return;

        // gather types and ids from features
        const types = new Map<string, number>();
        const coords = (features[0].geometry as GeoJSON.Point).coordinates as [number, number] | undefined;
        const ids: string[] = [];
        for (const f of features) {
          const props = (f.properties || {}) as Record<string, unknown>;
          const idRaw = props.binId ?? props.bin_id ?? props.id;
          const id = typeof idRaw === "string" ? idRaw : typeof idRaw === "number" ? String(idRaw) : undefined;
          if (id) ids.push(id);
          const t = (props.type as string) ?? binsRef.current.find((b) => (id ? b.binId === id : false))?.type ?? "unknown";
          const prev = types.get(t) ?? 0;
          types.set(t, prev + 1);
        }

        // build popup content: include type summary, optional address and tags
        let html = "";
        if (types.size === 1) {
          const only = Array.from(types.keys())[0];
          html = `<div><strong>Type</strong>: ${escapeHtml(only)}</div>`;
        } else {
          const parts = Array.from(types.entries()).map(([t, c]) => `${escapeHtml(t)} (${c})`);
          html = `<div><strong>Mixed types</strong>: ${parts.join(", ")}</div>`;
        }

        // address (if present on feature properties)
        try {
          const p0 = features[0].properties as Record<string, unknown> | undefined;
          const addr = p0 && typeof p0.address === "string" ? String(p0.address) : undefined;
          if (addr) html += `<div style="margin-top:6px;color:#333;font-size:13px">${escapeHtml(addr)}</div>`;

          // include tags (if present) as a small list
          const tags = p0 && typeof p0.tags === "object" && p0.tags ? (p0.tags as Record<string, unknown>) : undefined;
          if (tags) {
            const keys = Object.keys(tags).slice(0, 5);
            if (keys.length) {
              const tagParts = keys.map((k) => `${escapeHtml(k)}: ${escapeHtml(String((tags as Record<string, unknown>)[k] ?? ""))}`);
              html += `<div style="margin-top:6px;color:#666;font-size:12px">${tagParts.join(" • ")}</div>`;
            }
          }
        } catch {}

        // remove existing popup
        try {
          if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
          }
        } catch {}

        if (coords) {
          const popup = new mapboxgl.Popup({ offset: 10, className: "ww-bin-popup" }).setLngLat([coords[0], coords[1]]).setHTML(html).addTo(map);
          popupRef.current = popup;
        }

        // call optional bin click handler for the first matching id
        const firstId = ids[0];
        if (firstId) {
          const match = binsRef.current.find((b) => b.binId === firstId);
          if (match) onBinClickRef.current?.(match);
        }
      } catch {
        // guard against unexpected queryRenderedFeatures errors
      }
    };

    // auto-close popup when the user starts moving the map
    const onMapMoveStart = () => {
      try {
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      } catch {}
    };

    // set cursor when hovering
    const onMapMove = (e: mapboxgl.MapMouseEvent) => {
      try {
        const hit = map.queryRenderedFeatures(e.point, { layers: [LAYER_CLUSTER, LAYER_UNCLUSTERED] });
        map.getCanvas().style.cursor = hit && hit.length ? "pointer" : "";
      } catch {}
    };

    map.on("click", onMapClick);
    map.on("mousemove", onMapMove);
    map.on("movestart", onMapMoveStart);

    // cleanup handlers on remove
    return () => {
      try {
        map.off("click", onMapClick);
        map.off("mousemove", onMapMove);
        map.off("movestart", onMapMoveStart);
        try {
          if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
          }
        } catch {}
      } catch {
        // ignore cleanup errors
      }
    };
  }, [map, ready]);

  // update source data when bins change
  useEffect(() => {
    if (!ready || !map) return;
    const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
    if (!source) return;

    const features = bins
      .filter((b) => visibleTypes.includes(b.type))
      .map((b) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [b.coordinates.lng, b.coordinates.lat] },
        properties: {
          binId: b.binId,
          type: b.type,
          address: b.address,
          fullnessLevel: typeof b.fullnessLevel === "number" ? b.fullnessLevel : undefined,
        },
      }));

    try {
      source.setData({ type: "FeatureCollection", features });
    } catch (err) {
      console.warn("BinMarkers: failed to set source data", err);
    }
  }, [bins, visibleTypes, map, ready]);

  return null;
}