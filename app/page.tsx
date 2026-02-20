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
    <div className="min-h-screen bg-[#F8F9FE]">
      {/* Header */}
      <header className="bg-transparent sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/logo.jpg" alt="Masjid Finder" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-[#4B3F72]">Welcome, User</h1>
                <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => (window.location.href = '/auth/login')}
                variant="ghost"
                className="text-[#4B3F72] hover:bg-purple-100"
              >
                <Lock className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        <div className="relative mb-8">
          <Input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Find Nearest Masjid..."
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border-none shadow-sm text-gray-600 placeholder:text-gray-400 focus-visible:ring-purple-200"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-sm rounded-lg flex items-center justify-center">
             <MapPin className="w-5 h-5 text-[#4B3F72]" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#4B3F72]">{mosques.length} Nearest Mosques</h2>
          <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm">
             <Search className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mosques List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Searching...</p>
              </div>
            ) : mosques.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl shadow-sm">
                <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500">No masjids found nearby</p>
              </div>
            ) : (
              mosques.map((mosque) => (
                <Card
                  key={mosque.id}
                  onClick={() => setSelectedMosque(mosque)}
                  className={`relative overflow-hidden border-none rounded-3xl p-4 transition-all shadow-sm cursor-pointer ${
                    selectedMosque?.id === mosque.id ? 'ring-2 ring-purple-400' : 'bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <img 
                        src={mosque.rating ? `https://images.unsplash.com/photo-1542610121-31406836968d?w=200&h=200&fit=crop` : '/logo.jpg'} 
                        alt={mosque.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-blue-400">4.0 Km</span>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                          <span className="text-xs font-bold text-yellow-600">4.5</span>
                          <span className="text-[10px] text-yellow-400">★</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-[#4B3F72] text-lg truncate mb-1">{mosque.name}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-3">{mosque.address}</p>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-xl px-4 h-8 text-xs font-bold"
                      >
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Map View */}
          <div className="relative">
            <Card className="border-none bg-white rounded-[40px] overflow-hidden shadow-sm h-[500px] lg:sticky lg:top-24">
              <MosqueMap mosques={mosques} />
            </Card>
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
