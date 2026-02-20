'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import of MapContainer and other react-leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

interface Mosque {
  id: number;
  name: string;
  address: string;
  city?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
}

interface MosqueMapProps {
  mosques: Mosque[];
}

// Custom icon for mosques
const createMosqueIcon = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const L = require('leaflet');
    return L.icon({
      iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSI4IiBmaWxsPSIjMTBiOTgxIi8+PHBhdGggZD0iTTI0IDEwQzIxLjc5IDEwIDIwIDExLjc5IDIwIDE0QzIwIDE3LjMxIDI0IDIyIDI0IDIyQzI0IDIyIDI4IDE3LjMxIDI4IDE0QzI4IDExLjc5IDI2LjIxIDEwIDI0IDEwWiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIyNCIgY3k9IjE0IiByPSIyIiBmaWxsPSIjMTBiOTgxIi8+PHBhdGggZD0iTTI0IDI0QzIwLjEzIDI0IDE3IDI3LjEzIDE3IDMxVjM0QzE3IDM1LjEwNDYgMTcuODk1NCAzNiAxOSAzNkgzMUMzMi4xMDQ2IDM2IDMzIDM1LjEwNDYgMzMgMzRWMzFDMzMgMjcuMTMgMjkuODcgMjQgMjYgMjRIMjRaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48],
    });
  } catch (error) {
    console.error('Error creating mosque icon:', error);
    return null;
  }
};

export default function MosqueMap({ mosques }: MosqueMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-slate-700 rounded-lg flex items-center justify-center">
        <div className="text-slate-400">Loading map...</div>
      </div>
    );
  }

  if (mosques.length === 0) {
    return (
      <div className="w-full h-full bg-slate-700 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-2">No mosques to display</p>
          <p className="text-sm text-slate-500">Add mosques to the admin dashboard</p>
        </div>
      </div>
    );
  }

  const center: [number, number] = [
    mosques.reduce((sum, m) => sum + m.latitude, 0) / mosques.length,
    mosques.reduce((sum, m) => sum + m.longitude, 0) / mosques.length,
  ];

  return (
    <MapContainer
      center={center}
      zoom={4}
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      className="z-10"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mosques.map((mosque) => (
        <Marker
          key={mosque.id}
          position={[mosque.latitude, mosque.longitude]}
          icon={createMosqueIcon()}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-slate-900 mb-1">{mosque.name}</h3>
              <p className="text-sm text-slate-600 mb-2">{mosque.address}</p>
              {mosque.city && <p className="text-xs text-slate-500 mb-1">{mosque.city}</p>}
              {mosque.phone && (
                <p className="text-xs text-slate-600 mb-1">
                  <a href={`tel:${mosque.phone}`} className="text-emerald-600 hover:underline">
                    {mosque.phone}
                  </a>
                </p>
              )}
              {mosque.email && (
                <p className="text-xs text-slate-600">
                  <a href={`mailto:${mosque.email}`} className="text-emerald-600 hover:underline">
                    {mosque.email}
                  </a>
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
