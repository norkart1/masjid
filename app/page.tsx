'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, Search, Clock, Phone, Mail, Lock } from 'lucide-react';
import MosqueMap from '@/components/public/mosque-map';

interface Mosque {
  id: number;
  name: string;
  address: string;
  city?: string;
  country?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  rating?: number;
}

export default function Home() {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [searchCity, setSearchCity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);

  const fetchMosques = useCallback(async () => {
    try {
      setIsLoading(true);
      let url = '/api/mosques';
      if (searchCity) {
        url += `?city=${encodeURIComponent(searchCity)}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMosques(data);
    } catch (error) {
      console.error('Error fetching mosques:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchCity]);

  useEffect(() => {
    fetchMosques();
  }, [fetchMosques]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Masjid Finder</h1>
                <p className="text-xs text-slate-400">Find mosques near you</p>
              </div>
            </div>
            <Button
              onClick={() => (window.location.href = '/auth/login')}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Lock className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen lg:h-[600px]">
          {/* Left Sidebar - Search & List */}
          <div className="lg:col-span-1 flex flex-col gap-4 overflow-hidden">
            {/* Search Box */}
            <Card className="border-slate-700 bg-slate-800 p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Search by City
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      placeholder="Enter city name..."
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                    <Button
                      onClick={() => fetchMosques()}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-slate-400">
                  {isLoading ? 'Loading...' : `Found ${mosques.length} mosque${mosques.length !== 1 ? 's' : ''}`}
                </div>
              </div>
            </Card>

            {/* Mosques List */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2 pr-2">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Loading mosques...</p>
                  </div>
                ) : mosques.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No mosques found</p>
                  </div>
                ) : (
                  mosques.map((mosque) => (
                    <Card
                      key={mosque.id}
                      onClick={() => setSelectedMosque(mosque)}
                      className={`border cursor-pointer transition-all p-3 ${
                        selectedMosque?.id === mosque.id
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <h3 className="font-semibold text-white text-sm mb-1">{mosque.name}</h3>
                      <p className="text-xs text-slate-400 mb-2">{mosque.address}</p>
                      {mosque.city && (
                        <p className="text-xs text-slate-500">{mosque.city}</p>
                      )}
                      {mosque.phone && (
                        <p className="text-xs text-emerald-400 mt-2">
                          <Phone className="w-3 h-3 inline mr-1" />
                          {mosque.phone}
                        </p>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Map & Details */}
          <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
            {/* Map */}
            <Card className="border-slate-700 bg-slate-800 flex-1 overflow-hidden p-0">
              <MosqueMap mosques={mosques} />
            </Card>

            {/* Selected Mosque Details */}
            {selectedMosque && (
              <Card className="border-slate-700 bg-slate-800 p-4">
                <h2 className="text-lg font-bold text-white mb-3">{selectedMosque.name}</h2>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{selectedMosque.address}</p>
                      {selectedMosque.city && <p className="text-slate-400">{selectedMosque.city}</p>}
                    </div>
                  </div>
                  {selectedMosque.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <a href={`tel:${selectedMosque.phone}`} className="hover:text-emerald-400">
                        {selectedMosque.phone}
                      </a>
                    </div>
                  )}
                  {selectedMosque.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-400" />
                      <a href={`mailto:${selectedMosque.email}`} className="hover:text-emerald-400">
                        {selectedMosque.email}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">
                      {selectedMosque.latitude.toFixed(4)}, {selectedMosque.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          <p>Masjid Finder © 2024 - Help your community find nearby mosques</p>
        </div>
      </footer>
    </div>
  );
}
