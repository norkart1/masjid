// Database schema types for type safety

export interface Mosque {
  id: number;
  name: string;
  description?: string;
  address: string;
  city?: string;
  country?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PrayerTime {
  id: number;
  mosque_id: number;
  fajr?: string;
  dhuhr?: string;
  asr?: string;
  maghrib?: string;
  isha?: string;
  updated_at: Date;
}

export interface Admin {
  id: number;
  username: string;
  password_hash: string;
  created_at: Date;
}

// Validation schemas
export const mosqueValidation = {
  name: { min: 1, max: 255 },
  address: { min: 1, max: 255 },
  latitude: { min: -90, max: 90 },
  longitude: { min: -180, max: 180 },
};
