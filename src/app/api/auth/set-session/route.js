import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function POST(request) {
  try {
    const body = await request.json();
    const session = body.session;
    if (!session) return NextResponse.json({ error: 'No session provided' }, { status: 400 });

    const { access_token, refresh_token, expires_at, user } = session;

    // Set HttpOnly cookies for session
    const response = NextResponse.json({ success: true });
    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    };
    response.cookies.set('sb-access-token', access_token, { ...cookieOpts, maxAge: 60 * 60 * 24 * 7 });
    response.cookies.set('sb-refresh-token', refresh_token, { ...cookieOpts, maxAge: 60 * 60 * 24 * 30 });
    response.cookies.set('sb-expires-at', String(expires_at), { ...cookieOpts, maxAge: 60 * 60 * 24 * 7 });

    // Ensure Prisma user exists / sync
    if (user && user.id) {
      const existing = await prisma.user.findUnique({ where: { id: user.id } });
      if (!existing) {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email.split('@')[0],
            password: '',
          },
        });
      }
    }

    return response;
  } catch (e) {
    console.error('set-session error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
