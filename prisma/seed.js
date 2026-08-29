const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with initial spiritual transmissions...');

  // Clear existing data (optional, but clean for seeding)
  await prisma.video.deleteMany({});

  const initialVideos = [
    {
      title: 'Brahma Muhurat 3:00 AM Meditation',
      description: 'Establish deep connection with your Higher Self during the sacred portal hour. Guided by Sunita Devi, under the divine grace of Mahavatar Babaji. Focuses on clearing mental static and tuning into planetary light grids.',
      url: 'https://www.youtube.com/watch?v=hJy6v8_2yXo',
      thumbnail: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600',
      duration: '45:00',
      category: 'Meditation',
      isPremium: false,
    },
    {
      title: 'Guided Morning Agnihotra and Breath Technique',
      description: 'Learn the daily solar fire purification method alongside simple pranayama exercises. Clears physical air quality and aligns the energy field for spiritual focus.',
      url: 'https://www.youtube.com/watch?v=1Gq67Y1qWgw',
      thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600',
      duration: '22:15',
      category: 'Breathwork',
      isPremium: false,
    },
    {
      title: 'Ancestral Karma Clearing & DNA Restructuring',
      description: 'A powerful high-frequency astral healing transmission. Dissolves inherited blocks and negative family patterns running through the bloodline. Best practiced in a quiet environment.',
      url: 'https://www.youtube.com/watch?v=5V_f54K-Cag',
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
      duration: '1:12:40',
      category: 'Ancestral Healing',
      isPremium: true,
    },
    {
      title: 'Chakra Balancing and Rainbow Body Activation',
      description: 'Advanced chakra meditation utilizing sound frequencies to align the energy centers. Unlocks the body\'s natural aura expansion and activates light bodies under Mataji\'s grace.',
      url: 'https://www.youtube.com/watch?v=6y2f-cQ-hJc',
      thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=600',
      duration: '35:50',
      category: 'Chakras',
      isPremium: true,
    },
    {
      title: 'Mahavatar Babaji: Co-Creating the New Age of Consciousness',
      description: 'Spiritual discourse on the teachings of the Kriya Yoga lineage. Learn how our daily practices contribute directly to elevating planetary consciousness.',
      url: 'https://www.youtube.com/watch?v=1F_F9cZl3Y4',
      thumbnail: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=600',
      duration: '50:12',
      category: 'Lectures',
      isPremium: true,
    }
  ];

  for (const video of initialVideos) {
    const created = await prisma.video.create({
      data: video
    });
    console.log(`Created transmission: ${created.title}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
