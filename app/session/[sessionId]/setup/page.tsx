'use client';

/**
 * Session Setup Page
 *
 * Collects display names for User A and User B
 */

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createUsers } from '@/lib/api/users';

export default function SetupPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [userAName, setUserAName] = useState('');
  const [userBName, setUserBName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate names
    if (!userAName.trim() || !userBName.trim()) {
      alert('Please enter both names');
      return;
    }

    setIsCreating(true);

    try {
      // Create both users
      const users = await createUsers(sessionId, userAName.trim(), userBName.trim());

      // Redirect to User A's swipe page
      router.push(`/session/${sessionId}/swipe/${users[0].id}`);
    } catch (error) {
      console.error('Failed to create users:', error);
      alert('Failed to create users. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👥</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Who&apos;s Watching?
          </h1>
          <p className="text-white/80">
            Enter names for both people
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8">
          {/* User A Name */}
          <div className="mb-6">
            <label
              htmlFor="userA"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Person 1
            </label>
            <input
              id="userA"
              type="text"
              value={userAName}
              onChange={(e) => setUserAName(e.target.value)}
              placeholder="Enter name"
              className="
                w-full px-4 py-3
                border-2 border-gray-200 rounded-xl
                focus:border-purple-500 focus:outline-none
                text-gray-900 placeholder-gray-400
                transition-colors
              "
              maxLength={50}
              disabled={isCreating}
            />
          </div>

          {/* User B Name */}
          <div className="mb-8">
            <label
              htmlFor="userB"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Person 2
            </label>
            <input
              id="userB"
              type="text"
              value={userBName}
              onChange={(e) => setUserBName(e.target.value)}
              placeholder="Enter name"
              className="
                w-full px-4 py-3
                border-2 border-gray-200 rounded-xl
                focus:border-purple-500 focus:outline-none
                text-gray-900 placeholder-gray-400
                transition-colors
              "
              maxLength={50}
              disabled={isCreating}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isCreating || !userAName.trim() || !userBName.trim()}
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
            {isCreating ? (
              <span className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Setting up...
              </span>
            ) : (
              'Start Swiping 🎬'
            )}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 text-center text-white/70 text-sm">
          <p>
            {userAName.trim() || 'Person 1'} will swipe first, then pass the device to{' '}
            {userBName.trim() || 'Person 2'}
          </p>
        </div>
      </div>
    </div>
  );
}
