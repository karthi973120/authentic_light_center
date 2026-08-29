import { NextResponse, cookies as nextCookies } from 'next/server';
import prisma from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Use Supabase to create the auth user (server-side with service role key)
    const { data: supaData, error: supaErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true,
    });

    if (supaErr) {
      console.error('Supabase createUser error:', supaErr);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    // Sign in the user to obtain a session
    const { data: signInData, error: signInErr } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (signInErr || !signInData.session) {
      console.error('Supabase sign-in after create error:', signInErr || signInData);
      // proceed without session but inform client
    }

    // Default first user to ADMIN, rest to USER
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? 'ADMIN' : 'USER';

    // Create or sync user record in Prisma using Supabase user id
    const user = await prisma.user.create({
      data: {
        id: supaData.user?.id || undefined,
        email,
        password: '',
        name: name || email.split('@')[0],
        role,
      },
    });

    // Prepare response and set Supabase session cookies if available
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    if (signInData?.session) {
      const { access_token, refresh_token, expires_at } = signInData.session;
      const cookieOpts = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      };
      response.cookies.set('sb-access-token', access_token, { ...cookieOpts, maxAge: 60 * 60 * 24 * 7 });
      response.cookies.set('sb-refresh-token', refresh_token, { ...cookieOpts, maxAge: 60 * 60 * 24 * 30 });
      response.cookies.set('sb-expires-at', String(expires_at), { ...cookieOpts, maxAge: 60 * 60 * 24 * 7 });
    }

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
