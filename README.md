# ♻️ WasteWise

**WasteWise** is a smart city web app that helps people quickly locate the nearest **trash**, **recycling**, and **compost** bins based on their current location.  
It improves community cleanliness, supports proper waste sorting, and helps cities identify where additional bins are needed.

WasteWise uses **OpenStreetMap data (via Overpass API)** to find real waste bin coordinates, and **Mapbox** to display an interactive map with live bin markers.

---

## Features

- **Locate Nearby Bins:** Find the closest waste, recycling, and compost bins around your current or searched location.
- **Interactive Map UI:** Smooth zooming, search, panning, and mobile-friendly controls via Mapbox.
- **Bin Type Icons:** Different marker styles for trash vs. recycling vs. compost.
- **Search Any Address:** Use the built-in location search to find bins in any neighborhood.
- **OSM-Powered Data:** Real, open-source bin data fetched directly from OpenStreetMap.
- **Add & Report Bins (Optional):** Community-driven reporting to identify missing or overflowing bins.
- **Account System (Team Member Feature):** Login, saved locations, and user report history (optional if implemented).

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js + React + TailwindCSS |
| Map Rendering | Mapbox GL JS |
| Bin Data Source | OpenStreetMap via Overpass API |
| Geocoding & Location Search | Mapbox Geocoder |
| Authentication (Optional) | AWS Cognito / Supabase Auth / Firebase Auth |
| Reporting & User Data (Optional) | DynamoDB / Supabase / MongoDB Atlas |

---

