'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, LayersControl, useMapEvents, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { Building, CampusBoundary } from '@/lib/types';
import L from 'leaflet';
import { Locate } from 'lucide-react';

interface MapViewProps {
  buildings: Building[];
  selectedBuilding: Building | null;
  onMarkerClick: (building: Building) => void;
  campusBoundary: CampusBoundary | null;
  routeGeoJSON: any | null; // GeoJSON line
}

// User Location Component
function UserLocation() {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  
  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 18, {
        animate: true,
      });
    },
    locationerror(e) {
      alert("Could not access your location. Please ensure location services are enabled.");
    }
  });

  const handleLocate = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent map click
    e.preventDefault();
    map.locate();
  };

  // Prevent map clicks propagating through the button
  useEffect(() => {
     // This is handled via standard event bubbling prevention in React usually, 
     // but Leaflet is tricky. We'll use a div wrapper.
  }, []);

  return (
    <>
      {position && (
        <CircleMarker 
          center={position} 
          radius={8} 
          pathOptions={{ 
            color: 'white', 
            fillColor: '#3b82f6', 
            fillOpacity: 1, 
            weight: 2 
          }}
        >
          <Popup>You are here</Popup>
        </CircleMarker>
      )}
      
      {/* Custom Control for Locate Button */}
      <div 
        className="leaflet-bottom leaflet-right" 
        style={{ pointerEvents: 'auto', bottom: '20px', right: '20px', position: 'absolute', zIndex: 1000 }}
      >
        <div className="leaflet-control leaflet-bar">
          <button 
            onClick={handleLocate}
            className="bg-white p-2 hover:bg-gray-100 focus:outline-none flex items-center justify-center h-10 w-10 border-2 border-transparent focus:border-blue-500 rounded shadow-md text-gray-700"
            title="Show My Location"
            style={{ width: '44px', height: '44px', cursor: 'pointer' }}
          >
            <Locate size={24} />
          </button>
        </div>
      </div>
    </>
  );
}

// Helper to update map view
function MapController({ selectedBuilding, routeGeoJSON, campusBoundary }: { selectedBuilding: Building | null, routeGeoJSON: any, campusBoundary: CampusBoundary | null }) {
  const map = useMap();

  useEffect(() => {
    if (campusBoundary && campusBoundary.geometry) {
        // Apply Campus Lock
        const g = campusBoundary.geometry;
        if (g.southWest && g.northEast) {
            const bounds = L.latLngBounds(
                [g.southWest.lat, g.southWest.lng],
                [g.northEast.lat, g.northEast.lng]
            );
            map.setMaxBounds(bounds);
            map.setMinZoom(15); // Adjust as seen fit
            map.fitBounds(bounds);
        }
    }
  }, [campusBoundary, map]);

  useEffect(() => {
    if (selectedBuilding) {
      map.flyTo([selectedBuilding.latitude, selectedBuilding.longitude], 18, {
        animate: true,
      });
    }
  }, [selectedBuilding, map]);

  useEffect(() => {
    if (routeGeoJSON) {
      const layer = L.geoJSON(routeGeoJSON);
      map.fitBounds(layer.getBounds(), { padding: [50, 50] });
    }
  }, [routeGeoJSON, map]);

  return null;
}

export default function MapView({ buildings, selectedBuilding, onMarkerClick, campusBoundary, routeGeoJSON }: MapViewProps) {
  
  // Default center (MWU Robe approx) - Updated to new Main Gate
  const defaultCenter: [number, number] = [7.142528, 39.996432];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      maxZoom={19}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Street Map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer checked name="Satellite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      
      <MapController selectedBuilding={selectedBuilding} routeGeoJSON={routeGeoJSON} campusBoundary={campusBoundary} />
      
      {/* User Location and Control */}
      <UserLocation />

      {/* Buildings Markers */}
      {buildings.map((building) => (
        <Marker
          key={building.id}
          position={[building.latitude, building.longitude]}
          eventHandlers={{
            click: () => onMarkerClick(building),
          }}
        >
          <Popup>{building.name}</Popup>
        </Marker>
      ))}

      {/* Route Line */}
      {routeGeoJSON && (
         <Polyline 
            positions={routeGeoJSON.coordinates.map((c: number[]) => [c[1], c[0]])} // GeoJSON is usually lng,lat - Leaflet wants lat,lng
            color="blue" 
            weight={5} 
         />
      )}
      
      {/* Boundary Visual (Optional) */}
      {/* Use standard Polygon if coordinates available */}
    </MapContainer>
  );
}
