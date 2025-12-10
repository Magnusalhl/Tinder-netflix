/**
 * Swipe API functions
 *
 * Functions for creating and managing swipes in Supabase
 */

import { supabase } from '../supabase';
import { Swipe, SwipeChoice } from '../types';

/**
 * Create a swipe record
 *
 * @param userId - The UUID of the user
 * @param movieId - The UUID of the movie
 * @param choice - 'yes' or 'no'
 * @returns The created swipe record
 */
export async function createSwipe(
  userId: string,
  movieId: string,
  choice: SwipeChoice
): Promise<Swipe> {
  const { data, error } = await supabase
    .from('swipes')
    .insert({
      user_id: userId,
      movie_id: movieId,
      choice: choice,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating swipe:', error);
    throw new Error(`Failed to create swipe: ${error.message}`);
  }

  return data;
}

/**
 * Get all swipes for a user
 *
 * @param userId - The UUID of the user
 * @returns Array of swipes by the user
 */
export async function getUserSwipes(userId: string): Promise<Swipe[]> {
  const { data, error } = await supabase
    .from('swipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching user swipes:', error);
    throw new Error(`Failed to fetch swipes: ${error.message}`);
  }

  return data;
}

/**
 * Get all swipes for a session (across all users)
 *
 * @param sessionId - The UUID of the session
 * @returns Array of all swipes in the session
 */
export async function getSessionSwipes(sessionId: string): Promise<Swipe[]> {
  const { data, error } = await supabase
    .from('swipes')
    .select(`
      *,
      users!inner (
        session_id
      )
    `)
    .eq('users.session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching session swipes:', error);
    throw new Error(`Failed to fetch session swipes: ${error.message}`);
  }

  return data;
}

/**
 * Check if a user has already swiped on a movie
 *
 * @param userId - The UUID of the user
 * @param movieId - The UUID of the movie
 * @returns The existing swipe if found, null otherwise
 */
export async function getExistingSwipe(
  userId: string,
  movieId: string
): Promise<Swipe | null> {
  const { data, error } = await supabase
    .from('swipes')
    .select('*')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle();

  if (error) {
    console.error('Error checking existing swipe:', error);
    return null;
  }

  return data;
}

/**
 * Get the count of swipes for a user
 *
 * @param userId - The UUID of the user
 * @returns Number of swipes by the user
 */
export async function getUserSwipeCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('swipes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    console.error('Error counting user swipes:', error);
    return 0;
  }

  return count || 0;
}
