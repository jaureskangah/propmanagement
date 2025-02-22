
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jhjhzwbvmkurwfohjxlu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impoamh6d2J2bWt1cndmb2hqeGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NDYyNjEsImV4cCI6MjA1MTIyMjI2MX0.lJVT21ew0ZZrx9QFVfOfUFWUnuD7Ts4bbYv-SlOJfEQ';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
