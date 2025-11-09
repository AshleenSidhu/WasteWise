"use client"

import React from "react";

type Props = { visibleTypes: ("recycle"|"compost"|"landfill")[]; onChange: (next: ("recycle"|"compost"|"landfill")[]) => void };

export default function FilterControl({ visibleTypes, onChange }: Props) {
  const toggle = (t: "recycle"|"compost"|"landfill") => onChange(visibleTypes.includes(t) ? visibleTypes.filter(x => x !== t) : [...visibleTypes, t]);
  return (
    <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10 }}>
      <button onClick={() => toggle("recycle")}>♻️</button>
      <button onClick={() => toggle("compost")}>🍃</button>
      <button onClick={() => toggle("landfill")}>🗑️</button>
    </div>
  );
}