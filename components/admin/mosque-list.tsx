'use client';

import { Button } from '@/components/ui/button';
import { Edit2, Trash2, MapPin, Phone, Mail } from 'lucide-react';

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

interface MosqueListProps {
  mosques: Mosque[];
  isLoading: boolean;
  onEdit: (mosque: Mosque) => void;
  onDelete: (id: number) => void;
}

export default function MosqueList({
  mosques,
  isLoading,
  onEdit,
  onDelete,
}: MosqueListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (mosques.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <MapPin className="w-12 h-12 text-slate-600 mb-3" />
        <p className="text-slate-400">No mosques found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {mosques.map((mosque) => (
        <div
          key={mosque.id}
          className="p-4 rounded-lg bg-slate-700 border border-slate-600 hover:border-slate-500 transition"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-2">{mosque.name}</h4>
              <div className="space-y-1 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{mosque.address}</span>
                </div>
                {mosque.city && <p className="text-slate-400 ml-6">{mosque.city}</p>}
                {mosque.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <a href={`tel:${mosque.phone}`} className="hover:text-emerald-400">
                      {mosque.phone}
                    </a>
                  </div>
                )}
                {mosque.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <a href={`mailto:${mosque.email}`} className="hover:text-emerald-400">
                      {mosque.email}
                    </a>
                  </div>
                )}
                <div className="text-slate-500 text-xs">
                  Coordinates: {mosque.latitude.toFixed(4)}, {mosque.longitude.toFixed(4)}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onEdit(mosque)}
                size="sm"
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-600"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => onDelete(mosque.id)}
                size="sm"
                variant="ghost"
                className="text-slate-300 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
