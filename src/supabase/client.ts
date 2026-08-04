import { createClient, SupabaseClient } from '@supabase/supabase-js';

const defaultUrl = 'https://cqepsbyiwohpomglvroi.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZXBzYnlpd29ocG9tZ2x2cm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4MTgzMTksImV4cCI6MjEwMTM5NDMxOX0.kvO-x95eneL3eSg0PsFmgtTD-FK4NXsOpN9O4KvzZhQ';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey
);

let supabaseInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    supabaseInstance = null;
  }
}

export const supabase = supabaseInstance;
