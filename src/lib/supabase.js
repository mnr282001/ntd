import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// ─── Generate short share slugs ───
// Using nanoid with a URL-safe alphabet, 8 chars → 2.8 trillion combos
import { nanoid } from 'nanoid';
export const generateSlug = () => nanoid(8);

// ─── Anonymous session ID for reactions ───
// Stored in localStorage so the same device gets consistent identity
const SESSION_KEY = 'ntd_session_id';
export const getSessionId = () => {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = nanoid(16);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
};
