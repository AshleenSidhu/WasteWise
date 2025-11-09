"use client"

import React, { useEffect, useRef, useState } from "react";
import type { Bin } from "./types";

type Props = {
  selectedBin: Bin | null;
  onClose: () => void;
  onOpenDirections: () => void;
  /** optional: parent can listen to text search changes */
  onSearch?: (q: string) => void;
  /** optional: parent can filter by bin type */
  onFilterChange?: (type: string | null) => void;
  width?: number;
  className?: string;
};

const FILTERS = [
  { key: "trash", label: "Trash", icon: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="6" y="7" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) },
  { key: "recycling", label: "Recycle", icon: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M21 12l-3 5-4-2v4l-6-3 3-5-4-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) },
  { key: "compost", label: "Compost", icon: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 3v6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="16" r="4" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ) },
];

export default function MapSidebar({ selectedBin, onClose, onOpenDirections, onSearch, onFilterChange, width = 320, className = "" }: Props) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    // focus the close button when a bin is selected for keyboard users
    if (selectedBin && closeRef.current) closeRef.current.focus();
  }, [selectedBin]);

  return (
    <nav className={`ww-sidebar ${className}`} style={{ width }} aria-label="Map sidebar">
      <div className="ww-sidebar__header">
        <h2 className="ww-sidebar__title">WasteWiser Map</h2>
        <p className="ww-sidebar__lead">Click a bin on the map to view its address and details. Use Directions to navigate (opens Google Maps).</p>

        {/* Search bar */}
        <div className="ww-sidebar__search">
          <input
            className="ww-search-input"
            placeholder="Search address or tag"
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              if (onSearch) onSearch(v);
            }}
            aria-label="Search bins by address or tag"
          />
        </div>

        {/* Filter buttons */}
        <div className="ww-filter-row" role="toolbar" aria-label="Filter bins">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`ww-filter-btn ${activeFilter === f.key ? "ww-filter-btn--active" : ""}`}
              onClick={() => {
                const next = activeFilter === f.key ? null : f.key;
                setActiveFilter(next);
                if (onFilterChange) onFilterChange(next);
              }}
              aria-pressed={activeFilter === f.key}
              title={f.label}
            >
              <span className="ww-filter-icon" aria-hidden>{f.icon}</span>
              <span className="ww-filter-label">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {!selectedBin ? (
        <div className="ww-sidebar__instructions">
          <h3>How to use</h3>
          <ol>
            <li>Pan / zoom the map to your area.</li>
            <li>Click a bin marker (grey circle) to see its address and tags.</li>
            <li>Press Directions to open navigation.</li>
          </ol>
        </div>
      ) : (
        <div className="ww-sidebar__details">
          <div className="ww-sidebar__row">
            <div>
              <h3>Bin details</h3>
              <div className="ww-sidebar__type">{selectedBin.type.toUpperCase()}</div>
              <div className="ww-sidebar__address">{selectedBin.address ?? "No address available"}</div>
              {selectedBin.city ? <div className="ww-sidebar__city">{selectedBin.city}</div> : null}
            </div>
            <button ref={closeRef} onClick={onClose} aria-label="Close details" className="ww-sidebar__close">✕</button>
          </div>

          <div className="ww-sidebar__actions">
            <button onClick={onOpenDirections} className="ww-btn ww-btn--primary">Open directions</button>
          </div>
        </div>
      )}
    </nav>
  );
}
