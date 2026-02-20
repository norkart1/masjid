# Masjid Finder

## Overview
A mosque finder web application built with Next.js 16, PostgreSQL, and Leaflet maps. Users can search for mosques by city and view them on a map. Includes an admin dashboard for managing mosque data.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Database**: PostgreSQL (Replit built-in, connected via `pg` library)
- **UI**: Tailwind CSS 4, Radix UI, shadcn/ui components
- **Maps**: Leaflet / react-leaflet
- **Auth**: bcryptjs for password hashing, cookie-based sessions

## Project Structure
- `app/` - Next.js App Router pages and API routes
  - `app/api/mosques/` - CRUD API for mosques
  - `app/api/auth/` - Login/logout endpoints
  - `app/api/setup/` - Database seeding endpoint
  - `app/api/health/` - Health check endpoint
  - `app/admin/` - Admin dashboard pages
  - `app/auth/` - Login page
- `components/` - React components (admin, public, ui)
- `lib/` - Database connection, schema types, auth utilities
- `scripts/` - SQL migration scripts
- `public/` - Static assets

## Database
- PostgreSQL with tables: `mosques`, `prayer_times`, `admin`
- Schema defined in `scripts/01-init-schema.sql`
- Connection via `DATABASE_URL` environment variable

## Running
- Dev: `npm run dev` (runs on 0.0.0.0:5000)
- Build: `npm run build`
- Start: `npm run start` (runs on 0.0.0.0:5000)

## Admin Access
- Default credentials: admin / 12345
