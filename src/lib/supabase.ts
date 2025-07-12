import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check for environment variables and validate them
const isValidSupabaseUrl = supabaseUrl && 
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  supabaseUrl !== 'https://mock.supabase.co' &&
  supabaseUrl.includes('.supabase.co');

const isValidSupabaseKey = supabaseAnonKey && 
  supabaseAnonKey !== 'your-anon-key-here' && 
  supabaseAnonKey !== 'mock-key' &&
  supabaseAnonKey.length > 20;

if (!supabaseUrl || !supabaseAnonKey || !isValidSupabaseUrl || !isValidSupabaseKey) {
  console.error('Missing Supabase environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  
  if (!isValidSupabaseUrl) {
    console.error('❌ VITE_SUPABASE_URL appears to be a placeholder. Please set your actual Supabase project URL.');
  }
  if (!isValidSupabaseKey) {
    console.error('❌ VITE_SUPABASE_ANON_KEY appears to be a placeholder. Please set your actual Supabase anon key.');
  }
  
  console.warn('🔧 Supabase not properly configured - running in development mode with mock data');
  console.warn('📖 Please check SETUP.md for configuration instructions');
  
  // Create a mock client for development
  if (import.meta.env.DEV) {
    console.warn('Running in development mode with mock Supabase client');
  }
}

// Create Supabase client (will work even with missing env vars in dev)
export const supabase = createClient<Database>(
  supabaseUrl || 'https://mock.supabase.co',
  supabaseAnonKey || 'mock-key'
);

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, userData: { name: string; location?: string }) => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { data: null, error: { message: 'Supabase not configured. Please check your environment variables.' } };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          location: userData.location || null,
        }
      }
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { data: null, error: { message: 'Supabase not configured. Please check your environment variables.' } };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { error: { message: 'Supabase not configured.' } };
    }
    
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { user: null, error: { message: 'Supabase not configured.' } };
    }
    
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  getCurrentSession: async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { session: null, error: { message: 'Supabase not configured.' } };
    }
    
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, auth state changes will not work');
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    
    return supabase.auth.onAuthStateChange(callback);
  }
}; 