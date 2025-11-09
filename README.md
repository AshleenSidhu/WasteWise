# ♻️ WasteWise

**WasteWise** is a smart city web app that helps people quickly locate the nearest **trash**, **recycling**, and **compost** bins based on their current location.  
It improves community cleanliness, supports proper waste sorting, and helps cities identify where additional bins are needed.

WasteWise uses **OpenStreetMap data (via Overpass API)** to find real waste bin coordinates, and **Mapbox** to display an interactive map with live bin markers.

---

## Features

- **Locate Nearby Bins:** Find the closest waste, recycling, and compost bins around your current or searched location.
- **Interactive Map UI:** Smooth zooming, search, panning, and mobile-friendly controls via Mapbox.
- **Search Any Address:** Use the built-in location search to find bins in any neighborhood.
- **Add & Report Bins (Optional):** Community-driven reporting to identify missing or overflowing bins.

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js + React + TailwindCSS |
| Map Rendering | Mapbox GL JS |
| Bin Data Source | OpenStreetMap via Overpass API |
| Geocoding & Location Search | Mapbox Geocoder |
| Authentication | AWS Cognito |
| Reporting & User Data | DynamoDB |

---

