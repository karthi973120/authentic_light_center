import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="profile-page">
      <Navbar />
      <main className="container">
        <ProfileCard user={user} />
      </main>
      <Footer />
    </div>
  );
}

export const dynamic = 'force-dynamic';
