import { supabase } from './supabase';

export interface UserSkills {
  offered: string[];
  wanted: string[];
}

// Get user's skills from database
export async function getUserSkills(userId: string): Promise<UserSkills> {
  try {
    // Get offered skills
    const { data: offeredData, error: offeredError } = await supabase
      .rpc('get_user_skills_offered', { user_uuid: userId });

    if (offeredError) {
      console.error('Error fetching offered skills:', offeredError);
      return { offered: [], wanted: [] };
    }

    // Get wanted skills
    const { data: wantedData, error: wantedError } = await supabase
      .rpc('get_user_skills_wanted', { user_uuid: userId });

    if (wantedError) {
      console.error('Error fetching wanted skills:', wantedError);
      return { offered: [], wanted: [] };
    }

    return {
      offered: offeredData?.map((row: any) => row.skill_name) || [],
      wanted: wantedData?.map((row: any) => row.skill_name) || []
    };
  } catch (error) {
    console.error('Error in getUserSkills:', error);
    return { offered: [], wanted: [] };
  }
}

// Add a skill to user's offered skills
export async function addUserSkillOffered(userId: string, skillName: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .rpc('add_user_skill_offered', { 
        user_uuid: userId, 
        skill_name: skillName 
      });

    if (error) {
      console.error('Error adding offered skill:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error in addUserSkillOffered:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Add a skill to user's wanted skills
export async function addUserSkillWanted(userId: string, skillName: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .rpc('add_user_skill_wanted', { 
        user_uuid: userId, 
        skill_name: skillName 
      });

    if (error) {
      console.error('Error adding wanted skill:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error in addUserSkillWanted:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Remove a skill from user's offered skills
export async function removeUserSkillOffered(userId: string, skillName: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .rpc('remove_user_skill_offered', { 
        user_uuid: userId, 
        skill_name: skillName 
      });

    if (error) {
      console.error('Error removing offered skill:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error in removeUserSkillOffered:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Remove a skill from user's wanted skills
export async function removeUserSkillWanted(userId: string, skillName: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .rpc('remove_user_skill_wanted', { 
        user_uuid: userId, 
        skill_name: skillName 
      });

    if (error) {
      console.error('Error removing wanted skill:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error in removeUserSkillWanted:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Update user's profile information
export async function updateUserProfile(userId: string, updates: {
  name?: string;
  location?: string;
  availability?: string[];
  is_public?: boolean;
}): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}