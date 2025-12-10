'use client';

/**
 * Results Page
 *
 * Displays the matched movies that both users liked.
 * Calculates matches and shows them in a grid.
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSessionMatches } from '@/lib/api/matches';
import { getSessionUsers } from '@/lib/api/users';
import { Movie, User } from '@/lib/types';
import ResultsList from '@/components/ResultsList';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [matches, setMatches] = useState<Movie[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load matches when component mounts
   */
  useEffect(() => {
    const loadResults = async () => {
      try {
        // Load users
        const sessionUsers = await getSessionUsers(sessionId);
        setUsers(sessionUsers);

        // Load matches
        const matchedMovies = await getSessionMatches(sessionId);
        setMatches(matchedMovies);

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load results:', error);
        alert('Failed to load results. Please try again.');
        setIsLoading(false);
      }
    };

    loadResults();
  }, [sessionId]);

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
          <p className="text-white text-lg">Calculating your matches...</p>
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
          {users.length === 2 && (
            <>
              {users[0].display_name} & {users[1].display_name}
            </>
          )}
        </h1>
        <p className="text-white/80 text-lg">
          {matches.length > 0
            ? "Here's what you both want to watch!"
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
