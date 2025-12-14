'use client';

/**
 * Join Page
 *
 * Allows users to join a session by entering their name.
 * Creates a single user and redirects to their swipe page.
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createUser, getSessionUsers } from '@/lib/api/users';

export default function JoinPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [displayName, setDisplayName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [sessionUsers, setSessionUsers] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  /**
   * Load existing users in the session
   */
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await getSessionUsers(sessionId);
        setSessionUsers(users.map((u) => u.display_name));
      } catch (error) {
        console.error('Failed to load session users:', error);
      }
    };

    loadUsers();
  }, [sessionId]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name
    if (!displayName.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsJoining(true);

    try {
      // Create the user
      const user = await createUser(sessionId, displayName.trim());

      // Redirect to their swipe page
      router.push(`/session/${sessionId}/swipe/${user.id}`);
    } catch (error) {
      console.error('Failed to join session:', error);
      alert('Failed to join session. Please try again.');
      setIsJoining(false);
    }
  };

  /**
   * Copy session ID to clipboard
   */
  const handleCopySessionId = async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy session ID');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👋</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Join Session
          </h1>
          <p className="text-white/80">
            Enter your name to start swiping
          </p>
        </div>

        {/* Session ID Display */}
        <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold text-white/70 mb-1">Session ID</p>
              <p className="text-sm text-white font-mono break-all">
                {sessionId}
              </p>
            </div>
            <button
              onClick={handleCopySessionId}
              className="
                px-4 py-2
                bg-white/20 hover:bg-white/30
                text-white text-sm font-semibold rounded-lg
                transition-all duration-200
                hover:scale-105 active:scale-95
                flex-shrink-0
              "
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-white/60 mt-2">
            Share this ID with friends so they can join!
          </p>
        </div>

        {/* Show existing users if any */}
        {sessionUsers.length > 0 && (
          <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
            <p className="text-xs font-semibold text-white/70 mb-2">
              Already in this session:
            </p>
            <div className="flex flex-wrap gap-2">
              {sessionUsers.map((name, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 text-white text-sm rounded-full"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Name Input */}
          <div className="mb-6">
            <label
              htmlFor="displayName"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Your Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="
                w-full px-4 py-3
                border-2 border-gray-200 rounded-xl
                focus:border-purple-500 focus:outline-none
                text-gray-900 placeholder-gray-400
                transition-colors
              "
              maxLength={50}
              disabled={isJoining}
              autoFocus
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isJoining || !displayName.trim()}
            className="
              w-full px-6 py-4
              bg-gradient-to-r from-pink-500 to-purple-600
              text-white text-lg font-semibold rounded-xl
              shadow-lg hover:shadow-xl
              transform transition-all duration-200
              hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:scale-100
            "
          >
            {isJoining ? (
              <span className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Joining...
              </span>
            ) : (
              'Start Swiping 🎬'
            )}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 text-center text-white/70 text-sm">
          <p>
            Once you join, you&apos;ll start swiping on movies. When everyone finishes, you&apos;ll see the matches!
          </p>
        </div>
      </div>
    </div>
  );
}
