import React, { createContext, useContext } from "react";
import mapboxgl from "mapbox-gl";

export type MapContextShape = { map: mapboxgl.Map | null; ready: boolean };
export const MapContext = createContext<MapContextShape>({ map: null, ready: false });
export const useMap = () => useContext(MapContext);
export default MapContext;
