'use client';

/**
 * Results Page
 *
 * Displays the matched movies that all users liked.
 * Waits for all users to finish before showing matches.
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSessionMatches } from '@/lib/api/matches';
import { getSessionUsers } from '@/lib/api/users';
import { getUserSwipeCount } from '@/lib/api/swipes';
import { getAllMovies } from '@/lib/api/movies';
import { Movie, User } from '@/lib/types';
import ResultsList from '@/components/ResultsList';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [matches, setMatches] = useState<Movie[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsersFinished, setAllUsersFinished] = useState(false);
  const [usersStillSwiping, setUsersStillSwiping] = useState<User[]>([]);

  /**
   * Check if all users have finished swiping
   */
  useEffect(() => {
    const checkUsersProgress = async () => {
      try {
        // Load users
        const sessionUsers = await getSessionUsers(sessionId);
        setUsers(sessionUsers);

        // Load total number of movies
        const allMovies = await getAllMovies();
        const totalMovies = allMovies.length;

        // Check swipe counts for all users
        const userSwipeCounts = await Promise.all(
          sessionUsers.map(async (u) => ({
            user: u,
            count: await getUserSwipeCount(u.id),
          }))
        );

        // Find users who haven't finished yet
        const stillSwiping = userSwipeCounts
          .filter(({ count }) => count < totalMovies)
          .map(({ user }) => user);

        if (stillSwiping.length === 0) {
          // Everyone is done - load matches
          setAllUsersFinished(true);
          const matchedMovies = await getSessionMatches(sessionId);
          setMatches(matchedMovies);
          setIsLoading(false);
        } else {
          // Some users still swiping
          setUsersStillSwiping(stillSwiping);
          setAllUsersFinished(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to check user progress:', error);
        alert('Failed to load results. Please try again.');
        setIsLoading(false);
      }
    };

    checkUsersProgress();
  }, [sessionId]);

  /**
   * Poll to check if all users are done (when waiting)
   */
  useEffect(() => {
    if (allUsersFinished || isLoading) return;

    const pollInterval = setInterval(async () => {
      try {
        // Load total number of movies
        const allMovies = await getAllMovies();
        const totalMovies = allMovies.length;

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
          // Everyone is done now - load matches
          setAllUsersFinished(true);
          const matchedMovies = await getSessionMatches(sessionId);
          setMatches(matchedMovies);
        } else {
          // Update the list of users still swiping
          setUsersStillSwiping(stillSwiping);
        }
      } catch (error) {
        console.error('Error polling user progress:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [allUsersFinished, isLoading, users, sessionId]);

  /**
   * Start a new session
   */
  const handleStartNewSession = () => {
    router.push('/');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Waiting for users state
  if (!allUsersFinished && usersStillSwiping.length > 0) {
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
            Waiting for Everyone to Finish
          </h2>

          <p className="text-lg text-white/80 mb-8">
            Results will appear when all participants complete their swipes
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

          {/* Show who has finished */}
          {users.length > usersStillSwiping.length && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <p className="text-sm font-semibold text-white/70 mb-3">
                Finished:
              </p>
              <div className="space-y-2">
                {users
                  .filter((u) => !usersStillSwiping.find((s) => s.id === u.id))
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-center gap-2 text-white"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>{user.display_name}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

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

  return (
    <div className="min-h-screen p-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">
          {matches.length > 0 ? '🎉' : '😢'}
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          {users.length === 1 && users[0].display_name}
          {users.length === 2 && `${users[0].display_name} & ${users[1].display_name}`}
          {users.length > 2 && (
            <>
              {users.slice(0, -1).map((u) => u.display_name).join(', ')} & {users[users.length - 1].display_name}
            </>
          )}
        </h1>
        <p className="text-white/80 text-lg">
          {matches.length > 0
            ? `Here's what ${users.length === 1 ? 'you' : 'you all'} want to watch!`
            : "No matches this time"}
        </p>
      </div>

      {/* Results */}
      <ResultsList matches={matches} sessionId={sessionId} />

      {/* Actions */}
      <div className="max-w-4xl mx-auto mt-12 flex justify-center gap-4">
        <button
          onClick={handleStartNewSession}
          className="
            px-8 py-4
            bg-white text-purple-900
            font-semibold rounded-full
            shadow-lg hover:shadow-xl
            transform transition-all duration-200
            hover:scale-105 active:scale-95
          "
        >
          Start New Session
        </button>
      </div>

      {/* Stats (optional) */}
      {matches.length > 0 && (
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            Session Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-white">
                {matches.length}
              </div>
              <div className="text-sm text-white/70">
                {matches.length === 1 ? 'Match' : 'Matches'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">
                {users.length}
              </div>
              <div className="text-sm text-white/70">People</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-white/70">Compatibility 😊</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
