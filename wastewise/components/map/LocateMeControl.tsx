"use client"

import React from "react";
import { useMap } from "./MapContext";

export default function LocateMeControl() {
  const { map, ready } = useMap();
  const handle = () => {
    if (!map || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(p => map.flyTo({ center: [p.coords.longitude, p.coords.latitude], zoom: 15 }));
  };
  if (!ready) return null;
  return (
    <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
      <button onClick={handle} title="Center on me">📍</button>
    </div>
  );
}