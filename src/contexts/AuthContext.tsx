import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, location?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to ensure user profile exists in profiles table
const ensureUserProfileExists = async (user: SupabaseUser) => {
  try {
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected if profile doesn't exist
      console.error('Error checking for existing profile:', checkError);
      return;
    }

    // If profile doesn't exist, create it
    if (!existingProfile) {
      const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
      const location = user.user_metadata?.location || null;

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          name: name,
          location: location,
          profile_photo: null,
          availability: [],
          is_public: true,
          is_admin: false,
          is_banned: false,
          rating: 0.0,
          total_swaps: 0
        });

      if (insertError) {
        console.error('Error creating profile:', insertError);
      } else {
        console.log('Profile created successfully for user:', user.id);
      }
    }
  } catch (error) {
    console.error('Error in ensureUserProfileExists:', error);
  }
};
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // Ensure profile exists for authenticated user
        if (data.session?.user) {
          await ensureUserProfileExists(data.session.user);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        // In development, if Supabase is not configured, just set loading to false
        if (import.meta.env.DEV) {
          console.warn('Supabase not configured, skipping session check');
        }
      } finally {
        setLoading(false);
      }
    };
    
    getSession();
    
    try {
      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Ensure profile exists for authenticated user
        if (session?.user) {
          await ensureUserProfileExists(session.user);
        }
      });
      return () => {
        listener.subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      return () => {};
    }
  }, []);

  const signUp = async (email: string, password: string, name: string, location?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, location: location || null }
        }
      });
      
      if (error) {
        setLoading(false);
        // Provide user-friendly error messages
        let userFriendlyError = error.message;
        
        if (error.message.includes('User already registered')) {
          userFriendlyError = 'An account with this email already exists. Please sign in instead.';
        } else if (error.message.includes('Password should be at least')) {
          userFriendlyError = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('Invalid email')) {
          userFriendlyError = 'Please enter a valid email address.';
        } else if (error.message.includes('Email rate limit exceeded')) {
          userFriendlyError = 'Too many signup attempts. Please wait a moment before trying again.';
        }
        
        return { error: userFriendlyError };
      }

      // Profile creation is now handled by ensureUserProfileExists
      // which will be called automatically when the auth state changes
      if (data.user) {
        await ensureUserProfileExists(data.user);
      }

      setLoading(false);
      return { error: null };
    } catch (error) {
      setLoading(false);
      return { error: error instanceof Error ? error.message : 'An error occurred during signup' };
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        // Provide user-friendly error messages
        let userFriendlyError = error.message;
        
        if (error.message.includes('Invalid login credentials')) {
          userFriendlyError = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          userFriendlyError = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('User not found')) {
          userFriendlyError = 'No account found with this email address. Please sign up first.';
        } else if (error.message.includes('Too many requests')) {
          userFriendlyError = 'Too many login attempts. Please wait a moment before trying again.';
        }
        
        return { error: userFriendlyError };
      }
      return { error: null };
    } catch (error) {
      setLoading(false);
      return { error: error instanceof Error ? error.message : 'An error occurred during signin' };
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
} 