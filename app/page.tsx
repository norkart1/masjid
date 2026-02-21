'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, Search, Settings, Plus, Home as HomeIcon, Navigation, Filter, Target } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'settings'>('home');

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

  const renderHome = () => (
    <div className="flex flex-col animate-in fade-in duration-500">
      {/* Header Section with Purple Gradient */}
      <section className="bg-gradient-to-b from-[#7C5CC4] to-[#9D7CD8] px-6 pt-12 pb-24 rounded-b-[40px] relative">
        <div className="flex justify-between items-start mb-6 text-white">
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome, Omar</h1>
            <p className="opacity-90 text-sm font-medium">Monday, 21 December 2020</p>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2 h-auto">
            <Filter className="w-6 h-6" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Input 
            placeholder="Find Nearest Masjid..." 
            className="h-14 pl-12 pr-12 rounded-2xl border-none bg-white shadow-lg text-gray-700 placeholder:text-gray-400 focus-visible:ring-0"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Target className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
        </div>
      </section>

      {/* Main White Content Area */}
      <section className="bg-white -mt-10 rounded-t-[40px] px-6 pt-8 pb-32 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#1A1C1E]">{mosques.length || 10} Nearest Mosques</h3>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-50 rounded-3xl animate-pulse" />)
          ) : mosques.length === 0 ? (
            // Mock data display for exact design match as requested
            [
              { name: 'Essawy Mosque', dist: '4.0', addr: 'Mahmoud Shaheen, Mansoura Qism 2, Dakahlia Governorate.', img: 'https://images.unsplash.com/photo-1542610121-31406836968d?w=300' },
              { name: 'Rahman Mosque', dist: '5.5', addr: 'Mahmoud Shaheen, Mansoura Qism 2, Dakahlia Governorate.', img: 'https://images.unsplash.com/photo-1590076215667-873d6f00918c?w=300' },
              { name: 'Alqady Mosque', dist: '6.0', addr: 'Mahmoud Shaheen, Mansoura Qism 2, Dakahlia Governorate.', img: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=300' }
            ].map((m, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="text-sm font-black text-[#2D9CDB] tracking-tight">{m.dist} <span className="text-[10px] font-bold">Km</span></span>
                    <div className="flex items-center gap-1 bg-[#FDF4E3] px-1.5 py-0.5 rounded-lg border border-[#F9E8C8]">
                      <span className="text-[10px] font-bold text-[#D4AF37]">4.5</span>
                      <span className="text-[8px] text-[#D4AF37]">★</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-xl text-[#1A1C1E] leading-tight mb-1">{m.name}</h4>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-3 line-clamp-2">{m.addr}</p>
                  <Button variant="secondary" className="bg-[#E9DDFE] hover:bg-[#DED0FB] text-[#7C5CC4] rounded-xl h-8 px-5 text-[11px] font-bold shadow-sm flex items-center gap-2">
                    Get Directions
                    <Navigation className="w-3 h-3 rotate-45" />
                  </Button>
                </div>
              </div>
            ))
          ) : mosques.map((mosque, i) => (
            <div key={mosque.id} className="flex gap-4">
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                <img src={`https://images.unsplash.com/photo-1542610121-31406836968d?w=300&sig=${i}`} alt={mosque.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex justify-between items-start mb-0.5">
                  <span className="text-sm font-black text-[#2D9CDB] tracking-tight">4.0 <span className="text-[10px] font-bold">Km</span></span>
                  <div className="flex items-center gap-1 bg-[#FDF4E3] px-1.5 py-0.5 rounded-lg border border-[#F9E8C8]">
                    <span className="text-[10px] font-bold text-[#D4AF37]">4.5</span>
                    <span className="text-[8px] text-[#D4AF37]">★</span>
                  </div>
                </div>
                <h4 className="font-bold text-xl text-[#1A1C1E] leading-tight mb-1">{mosque.name}</h4>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-3 line-clamp-2">{mosque.address}</p>
                <Button variant="secondary" className="bg-[#E9DDFE] hover:bg-[#DED0FB] text-[#7C5CC4] rounded-xl h-8 px-5 text-[11px] font-bold shadow-sm flex items-center gap-2">
                  Get Directions
                  <Navigation className="w-3 h-3 rotate-45" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-50 h-24 px-12 flex items-center justify-between z-50 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-[#2D9CDB]' : 'text-gray-300'}`}
        >
          <HomeIcon className="w-7 h-7" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <div className="relative -top-8">
          <Button className="w-16 h-16 rounded-full bg-[#7C5CC4] shadow-[0_10px_30px_rgba(124,92,196,0.3)] flex items-center justify-center p-0 border-[6px] border-white">
            <Plus className="w-8 h-8 text-white" />
          </Button>
        </div>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-[#2D9CDB]' : 'text-gray-300'}`}
        >
          <Settings className="w-7 h-7" />
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans antialiased">
      <main className="max-w-md mx-auto relative min-h-screen shadow-2xl bg-white overflow-hidden">
        {activeTab === 'home' ? renderHome() : (
          <div className="p-8 text-center pt-24">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <Button onClick={() => setActiveTab('home')} className="bg-[#7C5CC4]">Back to Home</Button>
          </div>
        )}
      </main>
    </div>
  );
}
