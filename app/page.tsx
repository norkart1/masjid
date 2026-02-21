'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Menu } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'Featured' | 'Latest' | 'Trending'>('Featured');

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

  return (
    <div className="min-h-screen bg-[#F0F5FA] font-sans antialiased flex justify-center items-start md:py-10">
      {/* Main Container - Mobile Responsive and Desktop Support */}
      <main className="w-full max-w-4xl bg-white md:rounded-[60px] shadow-2xl overflow-hidden min-h-screen md:min-h-[90vh] relative">
        
        {/* Header Section */}
        <header className="px-8 pt-12 pb-6 flex items-center justify-between">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Menu className="w-8 h-8 text-gray-800" />
          </button>
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-purple-100 shadow-sm">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="Profile" 
              className="w-full h-full object-cover bg-purple-500"
            />
          </div>
        </header>

        {/* Search Bar Section */}
        <div className="px-8 mb-10">
          <div className="relative group">
            <Input 
              placeholder="Search" 
              className="h-16 pl-14 pr-6 rounded-2xl border-none bg-[#F5F5F5] text-lg text-gray-700 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-gray-100 transition-all"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="px-8 mb-10 flex items-center gap-8 overflow-x-auto scrollbar-hide">
          {(['Featured', 'Latest', 'Trending'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-2xl font-bold transition-all whitespace-nowrap ${
                activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content List */}
        <div className="px-8 space-y-10 pb-20">
          {isLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="flex gap-6 animate-pulse">
                <div className="w-32 h-32 md:w-48 md:h-32 bg-gray-100 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-6 bg-gray-100 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
                </div>
              </div>
            ))
          ) : mosques.length === 0 ? (
            // Custom Mosque Cards following the design reference
            [
              { 
                title: 'Getting my first UI/UX Design Internship', 
                date: 'Jan 12', 
                readTime: '8 min read',
                img: 'https://images.unsplash.com/photo-1542610121-31406836968d?w=500&q=80',
                color: 'bg-blue-50'
              },
              { 
                title: 'The Worst Career Mistake Junior UX Designers Make', 
                date: 'Jan 10', 
                readTime: '4 min read',
                img: 'https://images.unsplash.com/photo-1590076215667-873d6f00918c?w=500&q=80',
                color: 'bg-pink-50'
              },
              { 
                title: "You're not Lazy, Bored or unmotivated.", 
                date: 'Jan 8', 
                readTime: '5 min read',
                img: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=500&q=80',
                color: 'bg-orange-50'
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start group cursor-pointer">
                <div className={`w-32 h-32 md:w-48 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 ${item.color} shadow-sm group-hover:shadow-md transition-shadow`}>
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                </div>
                <div className="flex-1 py-1">
                  <h4 className="font-bold text-xl md:text-2xl text-gray-900 leading-tight mb-3 group-hover:text-gray-600 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-gray-400 font-medium text-sm md:text-base">
                    <span>{item.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{item.readTime}</span>
                  </div>
                </div>
              </div>
            ))
          ) : mosques.map((mosque, i) => (
            <div key={mosque.id} className="flex gap-6 items-start group cursor-pointer">
              <div className="w-32 h-32 md:w-48 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 shadow-sm group-hover:shadow-md transition-shadow">
                <img 
                  src={`https://images.unsplash.com/photo-1542610121-31406836968d?w=500&sig=${i}`} 
                  alt={mosque.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1 py-1">
                <h4 className="font-bold text-xl md:text-2xl text-gray-900 leading-tight mb-3 group-hover:text-gray-600 transition-colors">
                  {mosque.name}
                </h4>
                <div className="flex items-center gap-2 text-gray-400 font-medium text-sm md:text-base">
                  <span>{mosque.city || 'Nearby'}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>4.5 Rating</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
