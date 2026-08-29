import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function POST(request) {
  try {
    const cookieStore = request.cookies;
    const accessToken = cookieStore.get('sb-access-token')?.value;

    // Attempt to revoke session server-side if possible
    if (accessToken) {
      try {
        await supabaseAdmin.auth.signOut();
      } catch (e) {
        // ignore
      }
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    response.cookies.delete('sb-expires-at');
    return response;
  } catch (e) {
    console.error('Logout error:', e);
    const response = NextResponse.json({ success: false });
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    response.cookies.delete('sb-expires-at');
    return response;
  }
}
