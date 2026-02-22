'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Menu, Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  image_url?: string;
}

export default function Home() {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Masjid', 'Musalla', 'Community'];

  const fetchMosques = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/mosques');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMosques(data);
    } catch (error) {
      console.error('Error fetching mosques:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMosques();
  }, [fetchMosques]);

  const favorites = mosques.slice(0, 3);
  const recommended = mosques.length > 0 ? mosques[0] : null;

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans antialiased flex justify-center items-start md:py-10">
      {/* Main Mobile-First Container */}
      <main className="w-full max-w-md bg-white md:rounded-[40px] shadow-2xl overflow-hidden min-h-screen md:min-h-[850px] relative flex flex-col">
        
        {/* Header Section */}
        <header className="px-6 pt-10 pb-4 flex items-center justify-end">
          <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <Menu className="w-6 h-6 text-gray-800" />
          </button>
        </header>

        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900 leading-tight max-w-[200px]">
            Find the best masjids near you...
          </h2>
        </div>

        {/* Search Bar Section */}
        <div className="px-6 mb-6">
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <Input 
              placeholder="Search" 
              className="h-14 pl-14 pr-6 rounded-2xl border-none bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-base text-gray-700 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-gray-100 transition-all"
            />
          </div>
        </div>

        {/* Favourite Section */}
        <section className="px-6 mb-8">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="w-[160px] h-[240px] flex-shrink-0 bg-gray-100 rounded-3xl animate-pulse" />
              ))
            ) : favorites.length > 0 ? (
              favorites.map((mosque) => (
                <div key={mosque.id} className="w-[160px] flex-shrink-0 bg-white rounded-3xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-50 group cursor-pointer transition-transform hover:scale-[1.02]">
                  <div className="relative h-[140px] rounded-2xl overflow-hidden mb-3">
                    <img 
                      src={mosque.image_url || `https://images.unsplash.com/photo-1542610121-31406836968d?w=300&q=80&sig=${mosque.id}`} 
                      alt={mosque.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2">{mosque.name}</h4>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4].map(star => (
                        <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="w-3 h-3 fill-yellow-400/30 text-yellow-400/30" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">4.7 (5367)</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-green-500 uppercase">Open</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] font-bold">5 min by car</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} className="w-[160px] flex-shrink-0 bg-white rounded-3xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-50">
                  <div className="h-[140px] rounded-2xl overflow-hidden mb-3 bg-gray-100">
                    <img src={`https://images.unsplash.com/photo-1542610121-31406836968d?w=300&q=80&sig=${i}`} alt="Masjid" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">Masjid Al-Noor</h4>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">4.7 (5367)</span>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-green-500 uppercase">Open</span>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] font-bold">5 min by car</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recommended Section */}
        <section className="px-6 pb-10 flex-grow">
          {recommended ? (
            <div className="bg-white rounded-[32px] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-50 flex items-center gap-4 group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                <img 
                  src={recommended.image_url || `https://images.unsplash.com/photo-1590076215667-873d6f00918c?w=300&q=80`} 
                  alt={recommended.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-base text-gray-900 mb-1">{recommended.name}</h4>
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 ml-1">4.7</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-green-500 uppercase">Open</span>
                      <span className="text-[10px] text-gray-400">|</span>
                      <span className="text-[10px] font-bold text-gray-400">Close at 5:00pm</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] font-bold">5 min by car</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[32px] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-50 flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={`https://images.unsplash.com/photo-1590076215667-873d6f00918c?w=300&q=80`} alt="Masjid" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-base text-gray-900 mb-1">Central Islamic Center</h4>
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 ml-1">4.7</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-green-500 uppercase">Open</span>
                    <span className="text-[10px] text-gray-400">|</span>
                    <span className="text-[10px] font-bold text-gray-400">Close at 5:00pm</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold">5 min by car</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
