/**
 * Session API functions
 *
 * Functions for creating and managing sessions in Supabase
 */

import { supabase } from '../supabase';
import { Session } from '../types';

/**
 * Create a new session
 *
 * @param sessionName - Optional name for the session
 * @returns The created session
 */
export async function createSession(sessionName?: string): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      session_name: sessionName || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error);
    throw new Error(`Failed to create session: ${error.message}`);
  }

  return data;
}

/**
 * Get a session by ID
 *
 * @param sessionId - The UUID of the session
 * @returns The session data
 */
export async function getSession(sessionId: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) {
    console.error('Error fetching session:', error);
    return null;
  }

  return data;
}

/**
 * Get a session with its associated users
 *
 * @param sessionId - The UUID of the session
 * @returns The session with users array
 */
export async function getSessionWithUsers(sessionId: string) {
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      users (*)
    `)
    .eq('id', sessionId)
    .single();

  if (error) {
    console.error('Error fetching session with users:', error);
    throw new Error(`Failed to fetch session: ${error.message}`);
  }

  return data;
}
