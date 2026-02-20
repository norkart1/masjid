'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LogOut, Plus, Edit2, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import MosqueForm from '@/components/admin/mosque-form';
import MosqueList from '@/components/admin/mosque-list';

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

export default function AdminDashboard() {
  const router = useRouter();
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMosque, setEditingMosque] = useState<Mosque | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  const handleDeleteMosque = async (id: number) => {
    if (!confirm('Are you sure you want to delete this mosque?')) return;
    
    try {
      const response = await fetch(`/api/mosques/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMosques(mosques.filter(m => m.id !== id));
      }
    } catch (error) {
      console.error('Error deleting mosque:', error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMosque(null);
    fetchMosques();
  };

  const filteredMosques = mosques.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Masjid Finder</h1>
              <p className="text-xs text-slate-400">Admin Dashboard</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-slate-700 bg-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-200 text-sm font-medium">Total Mosques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{mosques.length}</div>
              </CardContent>
            </Card>
            <Card className="border-slate-700 bg-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-200 text-sm font-medium">Cities Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {new Set(mosques.map(m => m.city)).size}
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-700 bg-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-200 text-sm font-medium">Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {new Set(mosques.map(m => m.city?.split(',')[1])).size}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mosques Section */}
          <Card className="border-slate-700 bg-slate-800">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-white">Manage Mosques</CardTitle>
                <CardDescription className="text-slate-400">Add, edit, or delete mosque information</CardDescription>
              </div>
              <Button
                onClick={() => {
                  setEditingMosque(null);
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white mt-4 md:mt-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Mosque
              </Button>
            </CardHeader>
            <CardContent>
              {showForm ? (
                <MosqueForm
                  mosque={editingMosque}
                  onClose={handleFormClose}
                />
              ) : (
                <>
                  <div className="mb-4">
                    <Input
                      placeholder="Search by name or city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <MosqueList
                    mosques={filteredMosques}
                    isLoading={isLoading}
                    onEdit={(mosque) => {
                      setEditingMosque(mosque);
                      setShowForm(true);
                    }}
                    onDelete={handleDeleteMosque}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
