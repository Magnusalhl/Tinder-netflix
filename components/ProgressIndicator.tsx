/**
 * ProgressIndicator Component
 *
 * Shows the current progress through the movie list (e.g., "Movie 5 of 20")
 */

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export default function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      {/* Text indicator */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-white/90">
          Movie {current} of {total}
        </span>
        <span className="text-sm font-medium text-white/90">
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
