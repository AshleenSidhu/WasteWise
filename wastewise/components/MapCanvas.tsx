"use client"

import {useEffect, useRef, useState} from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
// @ts-expect-error: no type declarations for this module
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

type Props = {
    onViewport: (c: {center: [number, number], bounds?: mapboxgl.LngLatBoundsLike, zoom: number}) => void;
    children?: React.ReactNode;
};

export default function MapCanvas({onViewport, children}: Props) {
    const mapNode = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);

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
    const notifyViewport = () => {
            const center = map.getCenter();
            const zoom = map.getZoom();
            const bounds = map.getBounds();
            onViewport({
                center: [center.lng, center.lat],
                bounds: bounds ?? undefined,
                zoom
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
    }, [onViewport]);




    //UI
    return (
        <div style={{position: "relative", width: "100%", height: "100%"}}>
            <div ref={mapNode} style={{ width: "100%", height: "100%"}}/>
            {isMapReady && children}

        </div>
    );

}