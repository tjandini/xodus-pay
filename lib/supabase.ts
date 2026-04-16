import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://azyzjchwzdwnegizwwgp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6eXpqY2h3emR3bmVnaXp3d2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMzc5ODUsImV4cCI6MjA5MTgxMzk4NX0.7XEkEqDk4XO7k_hjaAOu50qtg5JUnPLkksfKm0kAPHU'
)