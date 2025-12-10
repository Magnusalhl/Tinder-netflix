'use client';

/**
 * Swipe Page
 *
 * Main swiping interface where users swipe through movies.
 * Handles:
 * - Loading movies
 * - Recording swipes
 * - Progress tracking
 * - Handover between users
 * - Redirect to results when complete
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
import HandoverScreen from '@/components/HandoverScreen';

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
  const [showHandover, setShowHandover] = useState(false);

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
    // Find the other user
    const otherUser = users.find((u) => u.id !== user.id);
    if (!otherUser) {
      router.push(`/session/${sessionId}/results`);
      return;
    }

    // Check if the other user has also completed swiping
    const otherUserSwipeCount = await getUserSwipeCount(otherUser.id);

    if (otherUserSwipeCount >= totalMovies) {
      // Both users are done - go to results
      router.push(`/session/${sessionId}/results`);
    } else {
      // Show handover screen
      setShowHandover(true);
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
   * Handle continuing after handover screen
   */
  const handleContinueAfterHandover = () => {
    const otherUser = allUsers.find((u) => u.id !== userId);
    if (otherUser) {
      router.push(`/session/${sessionId}/swipe/${otherUser.id}`);
    }
  };

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

  // Show handover screen if needed
  if (showHandover && currentUser) {
    const otherUser = allUsers.find((u) => u.id !== userId);
    if (otherUser) {
      return (
        <HandoverScreen
          fromUser={currentUser}
          toUser={otherUser}
          onContinue={handleContinueAfterHandover}
        />
      );
    }
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
