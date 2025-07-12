import { supabase } from './supabase';

export interface SwapRequestData {
  fromUserId: string;
  toUserId: string;
  skillOfferedId: string;
  skillWantedId: string;
  message: string;
}

// Create a new swap request
export async function createSwapRequest(data: SwapRequestData): Promise<{ error: string | null }> {
  try {
    // Skip if Supabase is not properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://mock.supabase.co') {
      console.warn('Supabase not configured, cannot create swap request');
      return { error: 'Database not configured' };
    }

    const { error } = await supabase
      .from('swap_requests')
      .insert({
        from_user_id: data.fromUserId,
        to_user_id: data.toUserId,
        skill_offered_id: data.skillOfferedId,
        skill_wanted_id: data.skillWantedId,
        message: data.message,
        status: 'pending'
      });

    if (error) {
      console.error('Error creating swap request:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error in createSwapRequest:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Get skill ID by name
export async function getSkillIdByName(skillName: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('id')
      .eq('name', skillName)
      .single();

    if (error) {
      console.error('Error finding skill:', error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error('Error in getSkillIdByName:', error);
    return null;
  }
}

// Get user's swap requests
export async function getUserSwapRequests(userId: string) {
  try {
    const { data, error } = await supabase
      .from('swap_requests')
      .select(`
        *,
        from_profile:profiles!swap_requests_from_user_id_fkey(name, profile_photo),
        to_profile:profiles!swap_requests_to_user_id_fkey(name, profile_photo),
        skill_offered:skills!swap_requests_skill_offered_id_fkey(name),
        skill_wanted:skills!swap_requests_skill_wanted_id_fkey(name)
      `)
      .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching swap requests:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserSwapRequests:', error);
    return [];
  }
}