"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient as createSupabaseClient } from '@/utils/supabase/client';

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function handle() {
      try {
        const supabase = createSupabaseClient();
        // Parse the URL fragment and obtain session (returned by Supabase after OAuth)
        const { data, error: urlError } = await supabase.auth.getSessionFromUrl();
        if (urlError) throw urlError;

        const session = data.session;
        if (!session) throw new Error('No session returned');

        // Send session to server to set HttpOnly cookies and sync the user
        const res = await fetch('/api/auth/set-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Failed to set session on server');
        }

        // Redirect to app after successful sign-in
        router.replace('/meditation');
      } catch (e) {
        console.error('OAuth callback error', e);
        setError(e.message || 'Authentication failed');
      }
    }

    handle();
  }, [router]);

  return (
    <div style={{ padding: 40 }}>
      <h2>Signing you in...</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export const dynamic = 'force-dynamic';
