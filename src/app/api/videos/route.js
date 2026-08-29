import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// Fetch all videos (accessible by logged in users or guest users, but details differ based on auth)
export async function GET() {
  try {
    const user = await getCurrentUser();
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // If user is not subscribed, we hide the actual url of premium videos or mark them as locked
    const formattedVideos = videos.map((video) => {
      const isLocked = video.isPremium && (!user || !user.isSubscribed);
      return {
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
        duration: video.duration,
        category: video.category,
        isPremium: video.isPremium,
        isLocked,
        // Hide direct URL if locked to simulate secure streaming paywall
        url: isLocked ? null : video.url,
      };
    });

    return NextResponse.json({ videos: formattedVideos });
  } catch (error) {
    console.error('Fetch videos error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Add new video (Admin Only)
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { title, description, url, thumbnail, duration, category, isPremium } = await request.json();

    if (!title || !description || !url || !thumbnail || !duration || !category) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        url,
        thumbnail,
        duration,
        category,
        isPremium: !!isPremium,
      },
    });

    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error('Create video error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
