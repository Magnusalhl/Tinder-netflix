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
import { getUser, getSessionUsers, updateUser, deleteUser } from '@/lib/api/users';
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

  // Name confirmation state
  const [showNameConfirm, setShowNameConfirm] = useState(true);
  const [editedName, setEditedName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // Leave session state
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isLeavingSession, setIsLeavingSession] = useState(false);

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
        setEditedName(user.display_name);

        // Load all users in the session
        const users = await getSessionUsers(sessionId);
        setAllUsers(users);

        // Load all movies
        const allMovies = await getAllMovies();
        setMovies(allMovies);

        // Check if user has already started swiping
        const swipeCount = await getUserSwipeCount(userId);
        setCurrentIndex(swipeCount);

        // If user has already started swiping, skip name confirmation
        if (swipeCount > 0) {
          setShowNameConfirm(false);
        }

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
   * Handle name confirmation
   */
  const handleConfirmName = async () => {
    if (!currentUser || !editedName.trim()) {
      alert('Please enter a valid name');
      return;
    }

    setIsUpdatingName(true);

    try {
      // Update name if it changed
      if (editedName.trim() !== currentUser.display_name) {
        const updatedUser = await updateUser(userId, editedName.trim());
        setCurrentUser(updatedUser);
      }

      // Proceed to swiping
      setShowNameConfirm(false);
      setIsUpdatingName(false);
    } catch (error) {
      console.error('Failed to update name:', error);
      alert('Failed to update name. Please try again.');
      setIsUpdatingName(false);
    }
  };

  /**
   * Handle going back to join page
   */
  const handleGoBack = () => {
    router.push(`/session/${sessionId}/join`);
  };

  /**
   * Handle leaving the session
   */
  const handleLeaveSession = async () => {
    setIsLeavingSession(true);

    try {
      // Delete the user from the database
      await deleteUser(userId);

      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Failed to leave session:', error);
      alert('Failed to leave session. Please try again.');
      setIsLeavingSession(false);
      setShowLeaveConfirm(false);
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

  // Name confirmation screen
  if (showNameConfirm && currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <div className="text-4xl">👤</div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Confirm Your Name
            </h2>
            <p className="text-white/70">
              Make sure your name is correct before you start swiping
            </p>
          </div>

          {/* Name input */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <label className="block text-sm font-semibold text-white/70 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/50 border-2 border-white/30 focus:border-pink-500 focus:outline-none transition-colors"
              placeholder="Enter your name"
              disabled={isUpdatingName}
            />
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleConfirmName}
              disabled={isUpdatingName || !editedName.trim()}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isUpdatingName ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Updating...</span>
                </div>
              ) : (
                'Confirm & Start Swiping'
              )}
            </button>

            <button
              onClick={handleGoBack}
              disabled={isUpdatingName}
              className="w-full py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back to Join Page
            </button>
          </div>
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Leave Session button - top right */}
      <button
        onClick={() => setShowLeaveConfirm(true)}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors backdrop-blur-sm"
      >
        Leave Session
      </button>

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

      {/* Leave confirmation dialog */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-sm w-full border-2 border-white/10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <div className="text-3xl">⚠️</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Leave Session?
              </h3>
              <p className="text-white/70">
                Your progress will be lost and you&apos;ll be removed from this session.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLeaveSession}
                disabled={isLeavingSession}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLeavingSession ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Leaving...</span>
                  </div>
                ) : (
                  'Yes, Leave Session'
                )}
              </button>

              <button
                onClick={() => setShowLeaveConfirm(false)}
                disabled={isLeavingSession}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
