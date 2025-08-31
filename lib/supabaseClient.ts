import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Replace with your own Supabase URL and anonymous key
const supabaseUrl = 'https://uccbvgqkzmfdoyjtqhdj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjY2J2Z3Frem1mZG95anRxaGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTY5NzgsImV4cCI6MjA3MjIzMjk3OH0.HYoAXfC-XbR0JA4l9sE4fDMaj8DMtxlMuAnEE7Ry_9g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
