import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { signToken } from '@/lib/auth';
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

    if (supaErr || !supaData || !supaData.user) {
      console.error('Supabase signIn error:', supaErr || supaData);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    // Find or create Prisma user synced to Supabase user id
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: supaData.user.id,
          email: supaData.user.email,
          password: '',
          name: supaData.user.user_metadata?.name || supaData.user.email.split('@')[0],
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

    // Create JWT token (expires in 7 days)
    const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      exp: expires,
    });

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, isSubscribed },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
