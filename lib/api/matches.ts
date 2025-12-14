/**
 * Match calculation API functions
 *
 * Functions for calculating movie matches between users
 */

import { supabase } from '../supabase';
import { Movie } from '../types';

/**
 * Get matched movies for a session
 * Returns movies where BOTH users said "yes"
 *
 * @param sessionId - The UUID of the session
 * @returns Array of movies that both users liked
 */
export async function getSessionMatches(sessionId: string): Promise<Movie[]> {
  // Use the Postgres function we created in the schema
  const { data, error } = await supabase
    .rpc('get_session_matches', {
      session_uuid: sessionId,
    });

  if (error) {
    console.error('Error fetching matches using RPC:', error);
    // Fall back to client-side calculation if RPC fails
    return getSessionMatchesClientSide(sessionId);
  }

  return data || [];
}

/**
 * Client-side implementation of match calculation
 * Fallback if the Postgres function doesn't work
 * Works with N users - returns movies where ALL users said 'yes'
 *
 * @param sessionId - The UUID of the session
 * @returns Array of movies that all users liked
 */
async function getSessionMatchesClientSide(sessionId: string): Promise<Movie[]> {
  // 1. Get all users in the session
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id')
    .eq('session_id', sessionId);

  if (usersError || !users || users.length === 0) {
    console.error('Error fetching users or no users found:', usersError);
    return [];
  }

  const totalUsers = users.length;

  // 2. Get all "yes" swipes for all users in the session
  const { data: allSwipes, error: swipesError } = await supabase
    .from('swipes')
    .select('user_id, movie_id')
    .in('user_id', users.map((u) => u.id))
    .eq('choice', 'yes');

  if (swipesError) {
    console.error('Error fetching swipes:', swipesError);
    return [];
  }

  if (!allSwipes || allSwipes.length === 0) {
    return [];
  }

  // 3. Count how many users liked each movie
  const movieLikeCounts = new Map<string, Set<string>>();

  for (const swipe of allSwipes) {
    if (!movieLikeCounts.has(swipe.movie_id)) {
      movieLikeCounts.set(swipe.movie_id, new Set());
    }
    movieLikeCounts.get(swipe.movie_id)!.add(swipe.user_id);
  }

  // 4. Find movies that ALL users liked
  const matchedMovieIds: string[] = [];

  for (const [movieId, userIds] of movieLikeCounts.entries()) {
    if (userIds.size === totalUsers) {
      matchedMovieIds.push(movieId);
    }
  }

  if (matchedMovieIds.length === 0) {
    return [];
  }

  // 5. Fetch the full movie data for matched IDs
  const { data: movies, error: moviesError } = await supabase
    .from('movies')
    .select('*')
    .in('id', matchedMovieIds)
    .order('title', { ascending: true });

  if (moviesError) {
    console.error('Error fetching matched movies:', moviesError);
    return [];
  }

  return movies || [];
}

/**
 * Get movies that only one specific user liked
 * Useful for showing "Only you liked" or "Only they liked" sections
 *
 * @param sessionId - The UUID of the session
 * @param userId - The UUID of the user
 * @returns Array of movies only this user liked
 */
export async function getUserOnlyLikes(
  sessionId: string,
  userId: string
): Promise<Movie[]> {
  // 1. Get the other user in the session
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id')
    .eq('session_id', sessionId)
    .neq('id', userId);

  if (usersError || !users || users.length === 0) {
    return [];
  }

  const otherUserId = users[0].id;

  // 2. Get movies this user liked
  const { data: thisUserLikes, error: thisError } = await supabase
    .from('swipes')
    .select('movie_id')
    .eq('user_id', userId)
    .eq('choice', 'yes');

  if (thisError) {
    console.error('Error fetching user likes:', thisError);
    return [];
  }

  // 3. Get movies the other user said "no" to or didn't swipe
  const { data: otherUserDislikes, error: otherError } = await supabase
    .from('swipes')
    .select('movie_id')
    .eq('user_id', otherUserId)
    .eq('choice', 'no');

  if (otherError) {
    console.error('Error fetching other user dislikes:', otherError);
    return [];
  }

  // 4. Get movies the other user liked (to exclude)
  const { data: otherUserLikes, error: otherLikesError } = await supabase
    .from('swipes')
    .select('movie_id')
    .eq('user_id', otherUserId)
    .eq('choice', 'yes');

  if (otherLikesError) {
    return [];
  }

  // 5. Find movies only this user liked
  const thisUserMovieIds = thisUserLikes?.map((s) => s.movie_id) || [];
  const otherUserLikedIds = new Set(otherUserLikes?.map((s) => s.movie_id) || []);

  const onlyThisUserLikes = thisUserMovieIds.filter(
    (id) => !otherUserLikedIds.has(id)
  );

  if (onlyThisUserLikes.length === 0) {
    return [];
  }

  // 6. Fetch movie data
  const { data: movies, error: moviesError } = await supabase
    .from('movies')
    .select('*')
    .in('id', onlyThisUserLikes)
    .order('title', { ascending: true });

  if (moviesError) {
    console.error('Error fetching movies:', moviesError);
    return [];
  }

  return movies || [];
}
