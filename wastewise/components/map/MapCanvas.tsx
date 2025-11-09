"use client"

import {useEffect, useRef, useState} from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
// @ts-expect-error: no type declarations for this module
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapContext from "./MapContext";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

type Props = {
    onViewport: (c: {center: [number, number], bounds?: mapboxgl.LngLatBoundsLike, zoom: number}) => void;
    children?: React.ReactNode;
};

export default function MapCanvas({onViewport, children}: Props) {
    const mapNode = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);

    // keep latest onViewport in a ref so we don't have to re-create the map when
    // the parent recreates the callback (prevents create/remove loop)
    const onViewportRef = useRef(onViewport);
    useEffect(() => { onViewportRef.current = onViewport; }, [onViewport]);

    useEffect(() => {
        if (!mapNode.current || mapRef.current) return;
        
        //Create map initally calgary
        const map = new mapboxgl.Map({
            container: mapNode.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [-114.0708, 51.0486],
            zoom: 12
        });
    mapRef.current = map;
    setMapInstance(map);

        //Add a locate me control
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {enableHighAccuracy: true},
            trackUserLocation: true,
            showUserHeading: true
        });

        map.addControl(geolocate, "top-right");

        //Add search bar from Mapbox geolocator
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: false,
            placeholder: "Search address"
        });
        map.addControl(geocoder, "top-left");

    //Let the app know that the user is done zooming
        // remember last viewport we reported so we don't notify parent of identical programmatic moves
        const lastViewportRef = { current: null as { center: [number, number]; zoom: number; bounds?: mapboxgl.LngLatBoundsLike } | null };

        const notifyViewport = () => {
            const center = map.getCenter();
            const zoom = map.getZoom();
            const bounds = map.getBounds();

            // Normalize bounds to possibly undefined (map.getBounds() may return an object)
            const newV = { center: [center.lng, center.lat] as [number, number], zoom, bounds: (bounds ?? undefined) as mapboxgl.LngLatBoundsLike | undefined };

            const last = lastViewportRef.current;
            const nearlyEqual = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) <= eps;
            if (last) {
                if (nearlyEqual(last.zoom, newV.zoom, 1e-3) && nearlyEqual(last.center[0], newV.center[0]) && nearlyEqual(last.center[1], newV.center[1])) {
                    // no meaningful change, skip notify
                    return;
                }
            }

            lastViewportRef.current = newV;

            // call the latest callback from ref to avoid effect re-run
            onViewportRef.current({
                center: newV.center,
                bounds: bounds ?? undefined,
                zoom: newV.zoom,
            });
        };
        map.on("moveend" , notifyViewport);

        //when map is finished loading then mark it ready and send the initial viewpoint
        map.on("load", () => {
            setIsMapReady(true);
            notifyViewport();
        });

        //Cleanup
        return () => {
            map.off("moveend", notifyViewport);
            map.remove();
            mapRef.current = null;
        };
    }, []); // run once

    //UI
    return (
        <div style={{position: "relative", width: "100%", height: "100%"}}>
            <div ref={mapNode} style={{ width: "100%", height: "100%"}}/>
                        <MapContext.Provider value={{ map: mapInstance, ready: isMapReady }}>
                            {isMapReady && children}
                        </MapContext.Provider>

        </div>
    );

}