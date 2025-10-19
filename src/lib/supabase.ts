import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mccbckcdclofjmycjubk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jY2Jja2NkY2xvZmpteWNqdWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MzE1NDgsImV4cCI6MjA3NjQwNzU0OH0.XzCsrHlG3N371JDtM6JVAYtuK6q-dT0dH-lEoFP0xl0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
