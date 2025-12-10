'use client';

/**
 * Landing Page
 *
 * Entry point for the application.
 * Allows users to start a new matching session.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSession } from '@/lib/api/sessions';

export default function HomePage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Handle creating a new session
   */
  const handleStartSession = async () => {
    setIsCreating(true);

    try {
      // Create a new session in Supabase
      const session = await createSession();

      // Redirect to the setup page
      router.push(`/session/${session.id}/setup`);
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create session. Please check your Supabase configuration.');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* App Icon/Logo */}
        <div className="mb-8">
          <div className="text-8xl mb-4">🎬❤️</div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Tinder for Movies
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Swipe. Match. Watch together.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Two People
            </h3>
            <p className="text-sm text-white/70">
              Pass the device back and forth
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-4xl mb-3">👈👉</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Swipe Away
            </h3>
            <p className="text-sm text-white/70">
              Left for nope, right for yes
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Find Matches
            </h3>
            <p className="text-sm text-white/70">
              See what you both liked
            </p>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStartSession}
          disabled={isCreating}
          className="
            group relative
            px-12 py-5
            bg-white text-purple-900
            text-xl font-bold rounded-full
            shadow-2xl
            transform transition-all duration-200
            hover:scale-105 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:scale-100
          "
        >
          {isCreating ? (
            <span className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-900 border-t-transparent" />
              Creating Session...
            </span>
          ) : (
            'Start New Session'
          )}
        </button>

        {/* Instructions */}
        <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl">
          <h4 className="text-sm font-semibold text-white mb-3">How it works:</h4>
          <ol className="text-sm text-white/70 text-left space-y-2 max-w-md mx-auto">
            <li>1. Enter names for both people</li>
            <li>2. Person A swipes through all movies</li>
            <li>3. Pass device to Person B, who also swipes</li>
            <li>4. See your matched movies! 🎉</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
