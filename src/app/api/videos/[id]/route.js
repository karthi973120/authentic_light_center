import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const isLocked = video.isPremium && (!user || !user.isSubscribed);

    const formattedVideo = {
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      duration: video.duration,
      category: video.category,
      isPremium: video.isPremium,
      isLocked,
      url: isLocked ? null : video.url,
    };

    return NextResponse.json({ video: formattedVideo });
  } catch (error) {
    console.error('Fetch single video error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
