'use client';

/**
 * Swipe Page
 *
 * Main swiping interface where users swipe through movies.
 * Handles:
 * - Loading movies
 * - Recording swipes
 * - Progress tracking
 * - Waiting for other users to finish
 * - Redirect to results when everyone completes
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUser, getSessionUsers } from '@/lib/api/users';
import { getAllMovies } from '@/lib/api/movies';
import { createSwipe, getUserSwipeCount } from '@/lib/api/swipes';
import { User, Movie, SwipeChoice } from '@/lib/types';
import MovieCard from '@/components/MovieCard';
import SwipeButtons from '@/components/SwipeButtons';
import ProgressIndicator from '@/components/ProgressIndicator';

export default function SwipePage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  const userId = params.userId as string;

  // State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwipeLoading, setIsSwipeLoading] = useState(false);
  const [showWaiting, setShowWaiting] = useState(false);
  const [usersStillSwiping, setUsersStillSwiping] = useState<User[]>([]);

  /**
   * Load initial data
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load current user
        const user = await getUser(userId);
        if (!user) {
          alert('User not found');
          router.push('/');
          return;
        }
        setCurrentUser(user);

        // Load all users in the session
        const users = await getSessionUsers(sessionId);
        setAllUsers(users);

        // Load all movies
        const allMovies = await getAllMovies();
        setMovies(allMovies);

        // Check if user has already started swiping
        const swipeCount = await getUserSwipeCount(userId);
        setCurrentIndex(swipeCount);

        // If user has already swiped all movies, check what to do next
        if (swipeCount >= allMovies.length) {
          await handleUserComplete(user, users, allMovies.length);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load data:', error);
        alert('Failed to load data. Please check your connection.');
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId, sessionId, router]);

  /**
   * Handle when user has completed all swipes
   */
  const handleUserComplete = async (
    user: User,
    users: User[],
    totalMovies: number
  ) => {
    // Check swipe counts for all users
    const userSwipeCounts = await Promise.all(
      users.map(async (u) => ({
        user: u,
        count: await getUserSwipeCount(u.id),
      }))
    );

    // Find users who haven't finished yet
    const stillSwiping = userSwipeCounts
      .filter(({ count }) => count < totalMovies)
      .map(({ user }) => user);

    if (stillSwiping.length === 0) {
      // Everyone is done - go to results
      router.push(`/session/${sessionId}/results`);
    } else {
      // Show waiting screen
      setUsersStillSwiping(stillSwiping);
      setShowWaiting(true);
    }
  };

  /**
   * Handle a swipe action
   */
  const handleSwipe = async (choice: SwipeChoice) => {
    if (isSwipeLoading || !currentUser) return;

    const movie = movies[currentIndex];
    if (!movie) return;

    setIsSwipeLoading(true);

    try {
      // Record the swipe in Supabase
      await createSwipe(userId, movie.id, choice);

      // Move to next movie
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      // Check if this was the last movie
      if (nextIndex >= movies.length) {
        await handleUserComplete(currentUser, allUsers, movies.length);
      }

      setIsSwipeLoading(false);
    } catch (error) {
      console.error('Failed to record swipe:', error);
      alert('Failed to save your choice. Please try again.');
      setIsSwipeLoading(false);
    }
  };

  /**
   * Poll to check if all users are done (when on waiting screen)
   */
  useEffect(() => {
    if (!showWaiting || movies.length === 0) return;

    const pollInterval = setInterval(async () => {
      try {
        // Check if all users have finished
        const userSwipeCounts = await Promise.all(
          allUsers.map(async (u) => ({
            user: u,
            count: await getUserSwipeCount(u.id),
          }))
        );

        const stillSwiping = userSwipeCounts
          .filter(({ count }) => count < movies.length)
          .map(({ user }) => user);

        if (stillSwiping.length === 0) {
          // Everyone is done now - redirect to results
          router.push(`/session/${sessionId}/results`);
        } else {
          // Update the list of users still swiping
          setUsersStillSwiping(stillSwiping);
        }
      } catch (error) {
        console.error('Error polling user progress:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [showWaiting, allUsers, movies.length, sessionId, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4" />
          <p className="text-white text-lg">Loading movies...</p>
        </div>
      </div>
    );
  }

  // Show waiting screen if needed
  if (showWaiting && currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <div className="text-5xl">⏳</div>
            </div>
          </div>

          {/* Message */}
          <h2 className="text-3xl font-bold text-white mb-3">
            Great Job, {currentUser.display_name}!
          </h2>

          <p className="text-lg text-white/80 mb-8">
            You&apos;ve finished swiping. Waiting for others...
          </p>

          {/* List of users still swiping */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <p className="text-sm font-semibold text-white/70 mb-3">
              Still swiping:
            </p>
            <div className="space-y-2">
              {usersStillSwiping.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-center gap-2 text-white"
                >
                  <div className="animate-pulse w-2 h-2 bg-pink-500 rounded-full" />
                  <span>{user.display_name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-refresh indicator */}
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/60 border-t-transparent" />
            <span>Checking for updates...</span>
          </div>

          <p className="mt-6 text-sm text-white/60">
            This page will automatically refresh when everyone finishes
          </p>
        </div>
      </div>
    );
  }

  // Get current movie
  const currentMovie = movies[currentIndex];

  // If no more movies, show loading (while redirecting)
  if (!currentMovie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-white text-lg">All done! Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* User indicator */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white">
          {currentUser?.display_name}&apos;s Turn
        </h2>
      </div>

      {/* Progress indicator */}
      <ProgressIndicator current={currentIndex + 1} total={movies.length} />

      {/* Movie card */}
      <div className="mb-8">
        <MovieCard
          movie={currentMovie}
          onSwipe={handleSwipe}
          isLoading={isSwipeLoading}
        />
      </div>

      {/* Swipe buttons (desktop) */}
      <SwipeButtons
        onNo={() => handleSwipe('no')}
        onYes={() => handleSwipe('yes')}
        disabled={isSwipeLoading}
      />

      {/* Mobile hint */}
      <div className="mt-6 text-center md:hidden">
        <p className="text-white/70 text-sm">
          👈 Swipe left for nope, right for yes 👉
        </p>
      </div>
    </div>
  );
}
