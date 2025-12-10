/**
 * Movie API functions
 *
 * Functions for fetching movies from Supabase
 */

import { supabase } from '../supabase';
import { Movie } from '../types';

/**
 * Get all movies
 *
 * @returns Array of all movies in the database
 */
export async function getAllMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching movies:', error);
    throw new Error(`Failed to fetch movies: ${error.message}`);
  }

  return data;
}

/**
 * Get a random set of movies
 * Useful for providing a fresh experience each time
 *
 * @param limit - Number of movies to return (default: 30)
 * @returns Array of randomly selected movies
 */
export async function getRandomMovies(limit: number = 30): Promise<Movie[]> {
  // Note: Supabase doesn't have a built-in random function in the client library
  // So we'll fetch all movies and shuffle them client-side
  const allMovies = await getAllMovies();

  // Fisher-Yates shuffle algorithm
  const shuffled = [...allMovies];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, limit);
}

/**
 * Get a movie by ID
 *
 * @param movieId - The UUID of the movie
 * @returns The movie data
 */
export async function getMovie(movieId: string): Promise<Movie | null> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', movieId)
    .single();

  if (error) {
    console.error('Error fetching movie:', error);
    return null;
  }

  return data;
}

/**
 * Get movies by genre
 *
 * @param genre - The genre to filter by
 * @returns Array of movies in the specified genre
 */
export async function getMoviesByGenre(genre: string): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .contains('genres', [genre])
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching movies by genre:', error);
    throw new Error(`Failed to fetch movies by genre: ${error.message}`);
  }

  return data;
}
