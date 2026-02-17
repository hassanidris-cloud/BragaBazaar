// Supabase client setup for authentication, database, and storage
// This version is safe to use directly in the browser via ESM.
// IMPORTANT: This URL must match NEXT_PUBLIC_SUPABASE_URL on Vercel (same project).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Use only the anon (public) key here. Never put the service_role key in frontend code.
// service_role must only be used server-side (e.g. Vercel api/* via env vars).
export const supabase = createClient(
  'https://mfebgreczlxoqkiabsln.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZWJncmVjemx4b3FraWFic2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NTIyMjYsImV4cCI6MjA4NjEyODIyNn0.DZLqfz1S6KxYR7bCqxL14KL8Lso8uwTxxqvwOYqiodU'
);

// Admin PIN: required to open the admin panel (unless you log in with admin email below).
// Change this to your own 4–8 digit PIN. Used only in the browser; keep it private.
export const ADMIN_PIN = '1234';

// Admin email login: users with these emails can also access the admin panel by logging in
// at login.html?redirect=admin.html (same Supabase password as the main site). Create the user in Supabase if needed.
export const ADMIN_EMAILS = [
  'bragabazaar@gmail.com'
];
