'use client';

/**
 * Landing Page
 *
 * Entry point for the application.
 * Allows users to create a new session or join an existing one.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSession } from '@/lib/api/sessions';

export default function HomePage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [sessionIdInput, setSessionIdInput] = useState('');

  /**
   * Handle creating a new session
   */
  const handleCreateSession = async () => {
    setIsCreating(true);

    try {
      // Create a new session in Supabase
      const session = await createSession();

      // Redirect to the join page for this session
      router.push(`/session/${session.id}/join`);
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create session. Please check your Supabase configuration.');
      setIsCreating(false);
    }
  };

  /**
   * Handle joining an existing session
   */
  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = sessionIdInput.trim();

    if (!trimmedId) {
      alert('Please enter a session ID');
      return;
    }

    // Redirect to the join page for this session
    router.push(`/session/${trimmedId}/join`);
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
            <div className="text-4xl mb-3">📱</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Multi-Device
            </h3>
            <p className="text-sm text-white/70">
              Everyone swipes on their own device
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
              See what everyone liked
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4 mb-12">
          {/* Create Session Button */}
          <button
            onClick={handleCreateSession}
            disabled={isCreating}
            className="
              w-full max-w-md mx-auto block
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
              <span className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-900 border-t-transparent" />
                Creating Session...
              </span>
            ) : (
              'Create New Session'
            )}
          </button>

          {/* Join Session Section */}
          {!showJoinInput ? (
            <button
              onClick={() => setShowJoinInput(true)}
              disabled={isCreating}
              className="
                w-full max-w-md mx-auto block
                px-12 py-5
                bg-white/10 text-white border-2 border-white/30
                text-xl font-bold rounded-full
                backdrop-blur-sm
                transform transition-all duration-200
                hover:scale-105 active:scale-95
                hover:bg-white/20
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:scale-100
              "
            >
              Join Existing Session
            </button>
          ) : (
            <form onSubmit={handleJoinSession} className="max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <label htmlFor="sessionId" className="block text-sm font-semibold text-white mb-2">
                  Enter Session ID:
                </label>
                <input
                  id="sessionId"
                  type="text"
                  value={sessionIdInput}
                  onChange={(e) => setSessionIdInput(e.target.value)}
                  placeholder="Paste session ID here"
                  className="
                    w-full px-4 py-3 mb-4
                    bg-white/20 border-2 border-white/30 rounded-xl
                    text-white placeholder-white/50
                    focus:border-white focus:outline-none
                    transition-colors
                  "
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="
                      flex-1 px-6 py-3
                      bg-white text-purple-900
                      font-semibold rounded-xl
                      shadow-lg hover:shadow-xl
                      transform transition-all duration-200
                      hover:scale-105 active:scale-95
                    "
                  >
                    Join
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowJoinInput(false);
                      setSessionIdInput('');
                    }}
                    className="
                      px-6 py-3
                      bg-white/10 text-white border-2 border-white/30
                      font-semibold rounded-xl
                      transform transition-all duration-200
                      hover:scale-105 active:scale-95
                    "
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl">
          <h4 className="text-sm font-semibold text-white mb-3">How it works:</h4>
          <ol className="text-sm text-white/70 text-left space-y-2 max-w-md mx-auto">
            <li>1. Create a session or join with a session ID</li>
            <li>2. Share the session ID with friends</li>
            <li>3. Everyone swipes on their own device</li>
            <li>4. See your matched movies when everyone finishes! 🎉</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
