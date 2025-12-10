/**
 * User API functions
 *
 * Functions for creating and managing users in Supabase
 */

import { supabase } from '../supabase';
import { User } from '../types';

/**
 * Create two users for a session (User A and User B)
 *
 * @param sessionId - The UUID of the session
 * @param userAName - Display name for User A
 * @param userBName - Display name for User B
 * @returns Array of the two created users
 */
export async function createUsers(
  sessionId: string,
  userAName: string,
  userBName: string
): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        session_id: sessionId,
        display_name: userAName,
      },
      {
        session_id: sessionId,
        display_name: userBName,
      },
    ])
    .select();

  if (error) {
    console.error('Error creating users:', error);
    throw new Error(`Failed to create users: ${error.message}`);
  }

  return data;
}

/**
 * Get a user by ID
 *
 * @param userId - The UUID of the user
 * @returns The user data
 */
export async function getUser(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

/**
 * Get all users for a session
 *
 * @param sessionId - The UUID of the session
 * @returns Array of users in the session
 */
export async function getSessionUsers(sessionId: string): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching session users:', error);
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return data;
}
