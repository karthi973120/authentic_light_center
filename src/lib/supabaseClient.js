import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // It's fine to allow startup without keys during local edits; runtime will fail if used.
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
