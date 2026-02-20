'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, Search, Lock, Settings, Plus, Map as MapIcon, List, Bell, Navigation, Heart, Filter, MoreHorizontal, User } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'add' | 'prayers' | 'settings'>('home');

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

  const renderHome = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="relative h-48 rounded-[40px] overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1590076215667-873d6f00918c?w=1200&q=80" 
          alt="Hero" 
          className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Find Your Peace</h2>
          <p className="text-white/80 font-medium">Discover 500+ Masjids near your location</p>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-[#1A1C1E]">Featured Masjids</h3>
        <Button variant="ghost" className="text-[#6B4EFF] font-bold">View All</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          [1, 2].map(i => <div key={i} className="h-40 bg-gray-100 rounded-[32px] animate-pulse" />)
        ) : mosques.map((mosque) => (
          <Card key={mosque.id} className="p-6 rounded-[32px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all group cursor-pointer">
            <div className="flex gap-5">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1542610121-31406836968d?w=300" alt={mosque.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-1 rounded-lg">OPEN NOW</span>
                  <Heart className="w-5 h-5 text-gray-300 hover:text-red-500 transition-colors" />
                </div>
                <h4 className="font-bold text-lg truncate group-hover:text-[#6B4EFF] transition-colors">{mosque.name}</h4>
                <p className="text-sm text-gray-500 truncate mb-4">{mosque.address}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-[#6B4EFF]" />
                    <span className="text-xs font-bold">1.2 km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-yellow-500">4.9</span>
                    <span className="text-[10px] text-yellow-300">★</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        <Input 
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          placeholder="Search by city, name or zip..." 
          className="h-16 pl-14 pr-6 rounded-3xl border-none shadow-xl text-lg"
        />
        <Button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-2xl bg-[#6B4EFF] h-10">Search</Button>
      </div>
      <div className="h-[500px] rounded-[40px] overflow-hidden shadow-2xl relative border-8 border-white">
        <MosqueMap mosques={mosques} />
        <div className="absolute top-4 right-4 z-10 space-y-2">
          <Button variant="secondary" className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur shadow-lg p-0">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex items-center gap-6 p-8 bg-white rounded-[40px] shadow-sm">
        <div className="w-20 h-20 rounded-3xl bg-[#6B4EFF]/10 flex items-center justify-center">
          <User className="w-10 h-10 text-[#6B4EFF]" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Guest User</h3>
          <p className="text-gray-500">Configure your preferences</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {[
          { icon: Bell, label: 'Notifications', desc: 'Prayer alerts & announcements' },
          { icon: MapIcon, label: 'Map Preferences', desc: 'Default radius & map style' },
          { icon: Heart, label: 'Favorites', desc: 'Saved Masjids & communities' },
          { icon: Lock, label: 'Privacy', desc: 'Location access & account' }
        ].map((item, i) => (
          <Button key={i} variant="ghost" className="h-24 justify-start px-8 rounded-[32px] bg-white hover:bg-gray-50 group border border-transparent hover:border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mr-6 group-hover:bg-[#6B4EFF]/10 transition-colors">
              <item.icon className="w-6 h-6 text-gray-400 group-hover:text-[#6B4EFF]" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">{item.label}</p>
              <p className="text-sm text-gray-400 font-medium">{item.desc}</p>
            </div>
            <MoreHorizontal className="ml-auto w-6 h-6 text-gray-300" />
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-32">
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#6B4EFF]/5 rounded-full blur-[100px] -z-10 -mr-48 -mt-48" />

      {/* Header */}
      <header className="px-8 py-10 flex items-center justify-between max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1A1C1E]">
            {activeTab === 'home' && "Explorer"}
            {activeTab === 'search' && "Find Masjid"}
            {activeTab === 'settings' && "Settings"}
          </h1>
          <p className="text-gray-500 font-semibold mt-1">
            {activeTab === 'home' && "Discover sacred spaces"}
            {activeTab === 'search' && "Locate the nearest masjid"}
            {activeTab === 'settings' && "Manage your experience"}
          </p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center p-2 border border-gray-50">
          <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'search' && renderSearch()}
        {activeTab === 'settings' && renderSettings()}
      </main>

      {/* Luxury Bottom Nav */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white/80 backdrop-blur-3xl rounded-[35px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-white/50 p-3 flex items-center justify-between z-50">
        {[
          { id: 'home', icon: MapIcon, label: 'Home' },
          { id: 'search', icon: Search, label: 'Search' },
          { id: 'add', icon: Plus, isAction: true },
          { id: 'prayers', icon: List, label: 'Prayers' },
          { id: 'settings', icon: Settings, label: 'Settings' }
        ].map((item) => (
          item.isAction ? (
            <Button 
              key={item.id}
              onClick={() => setActiveTab('search')}
              className="w-16 h-16 rounded-3xl bg-[#1A1C1E] shadow-2xl hover:scale-110 transition-transform p-0 group"
            >
              <Plus className="w-8 h-8 text-white group-hover:rotate-90 transition-transform" />
            </Button>
          ) : (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all ${activeTab === item.id ? 'text-[#6B4EFF] bg-[#6B4EFF]/5' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-[#6B4EFF]/10' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          )
        ))}
      </nav>
    </div>
  );
}
