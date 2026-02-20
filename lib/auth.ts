import bcrypt from 'bcryptjs';
import { query } from './db';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function validateAdmin(username: string, password: string): Promise<boolean> {
  try {
    const result = await query('SELECT password_hash FROM admin WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return false;
    }
    
    const { password_hash } = result.rows[0];
    return verifyPassword(password, password_hash);
  } catch (error) {
    console.error('Error validating admin:', error);
    return false;
  }
}

export function setAdminSession(res: any, sessionId: string): void {
  res.setHeader('Set-Cookie', `adminSession=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict`);
}

export function getAdminSession(cookies: any): string | null {
  if (typeof cookies === 'string') {
    const match = cookies.match(/adminSession=([^;]*)/);
    return match ? match[1] : null;
  }
  return cookies?.adminSession || null;
}

export function clearAdminSession(res: any): void {
  res.setHeader('Set-Cookie', 'adminSession=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
}
