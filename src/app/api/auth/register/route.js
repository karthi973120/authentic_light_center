import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { signToken } from '@/lib/auth';
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
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
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
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
