'use client';

/**
 * SwipeButtons Component
 *
 * Displays "Nope" and "Yes" buttons for desktop swiping
 */

interface SwipeButtonsProps {
  onNo: () => void;
  onYes: () => void;
  disabled?: boolean;
}

export default function SwipeButtons({ onNo, onYes, disabled = false }: SwipeButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-8 mt-8">
      {/* Nope Button */}
      <button
        onClick={onNo}
        disabled={disabled}
        className={`
          group relative
          w-20 h-20 rounded-full
          bg-white shadow-lg
          flex items-center justify-center
          transform transition-all duration-200
          ${disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:scale-110 active:scale-95 hover:shadow-xl'
          }
        `}
        aria-label="Nope"
      >
        <svg
          className="w-10 h-10 text-red-500 group-hover:text-red-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Yes Button */}
      <button
        onClick={onYes}
        disabled={disabled}
        className={`
          group relative
          w-24 h-24 rounded-full
          bg-gradient-to-br from-pink-500 to-purple-600
          shadow-lg
          flex items-center justify-center
          transform transition-all duration-200
          ${disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:scale-110 active:scale-95 hover:shadow-xl'
          }
        `}
        aria-label="Yes"
      >
        <svg
          className="w-12 h-12 text-white group-hover:scale-110 transition-transform"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
    </div>
  );
}
