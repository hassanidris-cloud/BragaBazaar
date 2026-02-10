// Supabase client setup for authentication, database, and storage
// This version is safe to use directly in the browser via ESM.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Use only the anon (public) key here. Never put the service_role key in frontend code.
export const supabase = createClient(
  'https://mfebgreczlxoqkiabsln.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZWJncmVjemx4b3FraWFic2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NTIyMjYsImV4cCI6MjA4NjEyODIyNn0.DZLqfz1S6KxYR7bCqxL14KL8Lso8uwTxxqvwOYqiodU'
);

// Admin by email: users listed here are treated as admins and redirected to admin after login.
// Add your email (lowercase) so you can access admin without setting metadata in Supabase.
export const ADMIN_EMAILS = [
  'bragabazaar@gmail.com'
];
