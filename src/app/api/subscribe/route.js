import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { planId } = await request.json();
    if (!planId) {
      return NextResponse.json({ error: 'Plan selection is required' }, { status: 400 });
    }

    // Set subscription duration based on plan (simulated)
    let days = 30;
    if (planId === 'yearly') {
      days = 365;
    } else if (planId === 'weekly') {
      days = 7;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    // Update user in DB
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isSubscribed: true,
        subscriptionExpiresAt: expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription successful! Welcome to Authentic Light Center premium path.',
      expiresAt: updatedUser.subscriptionExpiresAt,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
