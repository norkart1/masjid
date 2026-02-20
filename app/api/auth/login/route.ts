import { validateAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Simple session storage (in production, use a database or Redis)
const activeSessions = new Map<string, { timestamp: number }>();

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
    }
    
    const isValid = await validateAdmin(username, password);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Create session token
    const sessionId = crypto.randomBytes(32).toString('hex');
    activeSessions.set(sessionId, { timestamp: Date.now() });
    
    const response = NextResponse.json({ message: 'Login successful', sessionId });
    response.cookies.set('adminSession', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SESSION_DURATION,
    });
    
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

export function isSessionValid(sessionId: string): boolean {
  const session = activeSessions.get(sessionId);
  if (!session) return false;
  
  const age = Date.now() - session.timestamp;
  if (age > SESSION_DURATION) {
    activeSessions.delete(sessionId);
    return false;
  }
  
  return true;
}

export function getActiveSessions() {
  return activeSessions;
}
