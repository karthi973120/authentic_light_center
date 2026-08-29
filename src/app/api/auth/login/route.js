import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Authenticate with Supabase
    const { data: supaData, error: supaErr } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    }).catch((e) => ({ error: e }));

    if (supaErr || !supaData || !supaData.session) {
      console.error('Supabase signIn error:', supaErr || supaData);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const supaUser = supaData.user;

    // Find or create Prisma user synced to Supabase user id
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: supaUser.id,
          email: supaUser.email,
          password: '',
          name: supaUser.user_metadata?.name || supaUser.email.split('@')[0],
        },
      });
    }

    // Auto-update expired subscription check
    let isSubscribed = user.isSubscribed;
    if (isSubscribed && user.subscriptionExpiresAt && new Date() > user.subscriptionExpiresAt) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isSubscribed: false },
      });
      isSubscribed = false;
    }

    // Prepare response and set Supabase session cookies
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, isSubscribed },
    });

    const session = supaData.session;
    const { access_token, refresh_token, expires_at } = session;
    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    };
    response.cookies.set('sb-access-token', access_token, { ...cookieOpts, maxAge: 60 * 60 * 24 * 7 });
    response.cookies.set('sb-refresh-token', refresh_token, { ...cookieOpts, maxAge: 60 * 60 * 24 * 30 });
    response.cookies.set('sb-expires-at', String(expires_at), { ...cookieOpts, maxAge: 60 * 60 * 24 * 7 });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
