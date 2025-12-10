'use client';

/**
 * HandoverScreen Component
 *
 * Displays when it's time to pass the device to the next user
 */

import { User } from '@/lib/types';

interface HandoverScreenProps {
  fromUser: User;
  toUser: User;
  onContinue: () => void;
}

export default function HandoverScreen({ fromUser, toUser, onContinue }: HandoverScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Great Job, {fromUser.display_name}!
        </h2>

        <p className="text-lg text-gray-600 mb-8">
          Now it&apos;s <span className="font-semibold text-purple-600">{toUser.display_name}&apos;s</span> turn to swipe.
        </p>

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="
            px-8 py-4
            bg-gradient-to-r from-pink-500 to-purple-600
            text-white text-lg font-semibold rounded-full
            shadow-lg hover:shadow-xl
            transform transition-all duration-200
            hover:scale-105 active:scale-95
          "
        >
          Let&apos;s Go! 🎬
        </button>

        {/* Instruction */}
        <p className="mt-6 text-sm text-gray-500">
          Pass the device to {toUser.display_name} and click the button above
        </p>
      </div>
    </div>
  );
}
