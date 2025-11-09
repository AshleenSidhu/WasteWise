"use client"

import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useMap } from "./MapContext";
import type { Bin } from "./types";

export default function AddBinControl({ onAdd }: { onAdd: (b: Partial<Bin>) => void }) {
  const { map, ready } = useMap();
  const [adding, setAdding] = useState(false);
  useEffect(() => {
    if (!map || !ready) return;
    const onClick = (e: mapboxgl.MapMouseEvent) => {
      if (!adding) return;
      onAdd({ coordinates: { lat: e.lngLat.lat, lng: e.lngLat.lng }, type: "landfill", fullnessLevel: 0 });
      setAdding(false);
    };
    map.on("click", onClick);
    return () => { map.off("click", onClick); };
  }, [adding, map, ready, onAdd]);
  if (!ready) return null;
  return (
    <div style={{ position: "absolute", top: 68, right: 12, zIndex: 10 }}>
      <button onClick={() => setAdding(v => !v)}>{adding ? "Click map to place" : "Add bin (click)"}</button>
      <button onClick={() => {
        if (!map) return;
        const c = map.getCenter();
        onAdd({ coordinates: { lat: c.lat, lng: c.lng }, type: "landfill", fullnessLevel: 0 });
      }}>Add at center</button>
    </div>
  );
}