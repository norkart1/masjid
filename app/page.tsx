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
      <section className="bg-[#7C5CC4] px-6 pt-16 pb-32 rounded-b-[60px] relative shadow-lg">
        <div className="flex justify-between items-center mb-10 text-white">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight">Welcome, Omar</h1>
            <p className="opacity-80 text-base font-semibold">Monday, 21 December 2020</p>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/10 rounded-2xl p-2 h-12 w-12 flex items-center justify-center">
            <Filter className="w-8 h-8" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Input 
            placeholder="Find Nearest Masjid..." 
            className="h-20 pl-16 pr-16 rounded-[30px] border-none bg-white shadow-2xl text-xl text-gray-700 placeholder:text-gray-400 focus-visible:ring-0"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-400" />
          <Target className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-900" />
        </div>
      </section>

      {/* Main White Content Area */}
      <section className="bg-white px-6 pt-10 pb-40 min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-[#1A1C1E] tracking-tight">10 Nearest Mosques</h3>
        </div>

        <div className="space-y-10">
          {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-50 rounded-3xl animate-pulse" />)
          ) : mosques.length === 0 ? (
            // Mock data display for exact design match as requested
            [
              { name: 'Essawy Mosque', dist: '4.0', addr: 'Mahmoud Shaheen, Mansoura Qism 2, Dakahlia Governorate.', img: 'https://images.unsplash.com/photo-1542610121-31406836968d?w=300' },
              { name: 'Rahman Mosque', dist: '5.5', addr: 'Mahmoud Shaheen, Mansoura Qism 2, Dakahlia Governorate.', img: 'https://images.unsplash.com/photo-1590076215667-873d6f00918c?w=300' },
              { name: 'Alqady Mosque', dist: '6.0', addr: 'Mahmoud Shaheen, Mansoura Qism 2, Dakahlia Governorate.', img: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=300' }
            ].map((m, i) => (
              <div key={i} className="flex gap-6 items-center">
                <div className="w-36 h-36 rounded-[40px] overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border-4 border-white">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-black text-[#2D9CDB] tracking-tighter">{m.dist} <span className="text-xs font-bold">Km</span></span>
                    <div className="flex items-center gap-1.5 bg-[#FEF9EC] px-3 py-1 rounded-2xl border border-[#F9E8C8]">
                      <span className="text-sm font-black text-[#D4AF37]">4.5</span>
                      <span className="text-xs text-[#D4AF37]">★</span>
                    </div>
                  </div>
                  <h4 className="font-black text-2xl text-[#1A1C1E] leading-tight mb-2">{m.name}</h4>
                  <p className="text-sm text-gray-500 font-bold leading-snug mb-4 line-clamp-2 pr-4">{m.addr}</p>
                  <Button variant="secondary" className="bg-[#F3EAFD] hover:bg-[#E9DDFE] text-[#7C5CC4] rounded-2xl h-11 px-6 text-sm font-black shadow-sm flex items-center gap-3 w-fit transition-all active:scale-95">
                    Get Directions
                    <Navigation className="w-5 h-5 rotate-45" />
                  </Button>
                </div>
              </div>
            ))
          ) : mosques.map((mosque, i) => (
            <div key={mosque.id} className="flex gap-6 items-center">
              <div className="w-36 h-36 rounded-[40px] overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border-4 border-white">
                <img src={`https://images.unsplash.com/photo-1542610121-31406836968d?w=300&sig=${i}`} alt={mosque.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-black text-[#2D9CDB] tracking-tighter">4.0 <span className="text-xs font-bold">Km</span></span>
                  <div className="flex items-center gap-1.5 bg-[#FEF9EC] px-3 py-1 rounded-2xl border border-[#F9E8C8]">
                    <span className="text-sm font-black text-[#D4AF37]">4.5</span>
                    <span className="text-xs text-[#D4AF37]">★</span>
                  </div>
                </div>
                <h4 className="font-black text-2xl text-[#1A1C1E] leading-tight mb-2">{mosque.name}</h4>
                <p className="text-sm text-gray-500 font-bold leading-snug mb-4 line-clamp-2 pr-4">{mosque.address}</p>
                <Button variant="secondary" className="bg-[#F3EAFD] hover:bg-[#E9DDFE] text-[#7C5CC4] rounded-2xl h-11 px-6 text-sm font-black shadow-sm flex items-center gap-3 w-fit transition-all active:scale-95">
                  Get Directions
                  <Navigation className="w-5 h-5 rotate-45" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fixed Footer Menu Design */}
      <div className="fixed bottom-0 left-0 right-1.5 z-50 px-6 pb-8">
        <nav className="bg-white h-24 rounded-[45px] shadow-[0_-20px_50px_rgba(0,0,0,0.08)] border border-gray-50 flex items-center justify-between px-16 relative">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'home' ? 'text-[#2D9CDB] scale-110' : 'text-gray-300 hover:text-gray-400'}`}
          >
            <HomeIcon className={`w-8 h-8 ${activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-xs font-black tracking-wider uppercase">Home</span>
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 -top-10">
            <Button className="w-20 h-20 rounded-full bg-[#7C5CC4] shadow-[0_15px_35px_rgba(124,92,196,0.4)] flex items-center justify-center p-0 border-[8px] border-white hover:scale-110 active:scale-95 transition-all duration-300">
              <Plus className="w-10 h-10 text-white stroke-[3px]" />
            </Button>
          </div>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'settings' ? 'text-[#2D9CDB] scale-110' : 'text-gray-300 hover:text-gray-400'}`}
          >
            <Settings className={`w-8 h-8 ${activeTab === 'settings' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-xs font-black tracking-wider uppercase">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <main className="max-w-md mx-auto relative min-h-screen bg-white shadow-2xl overflow-hidden scrollbar-hide">
        {activeTab === 'home' ? renderHome() : (
          <div className="flex flex-col animate-in fade-in duration-500">
             <section className="bg-[#7C5CC4] px-6 pt-16 pb-20 rounded-b-[60px] text-white">
                <h1 className="text-4xl font-extrabold mb-2">Settings</h1>
                <p className="opacity-80 font-semibold">Customize your app experience</p>
             </section>
             <div className="p-10 space-y-6">
                <Button onClick={() => setActiveTab('home')} className="w-full h-16 rounded-3xl bg-[#7C5CC4] text-xl font-bold shadow-xl">
                  Back to Dashboard
                </Button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
