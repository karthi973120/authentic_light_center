import { cookies } from 'next/headers';
import prisma from './db';
import { supabaseAdmin } from './supabaseServer';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;
    if (!accessToken) return null;

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(accessToken);
    if (userErr || !userData?.user) return null;

    const supaUser = userData.user;

    // Ensure Prisma user exists
    let user = await prisma.user.findUnique({ where: { id: supaUser.id } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: supaUser.id,
          email: supaUser.email,
          name: supaUser.user_metadata?.name || supaUser.email.split('@')[0],
          password: '',
        },
      });
    }

    // Check subscription expiry
    if (user && user.isSubscribed && user.subscriptionExpiresAt && new Date() > user.subscriptionExpiresAt) {
      await prisma.user.update({ where: { id: user.id }, data: { isSubscribed: false } });
      user.isSubscribed = false;
    }

    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}
