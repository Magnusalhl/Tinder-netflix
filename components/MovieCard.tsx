'use client';

/**
 * MovieCard Component
 *
 * Displays a movie card with poster, title, year, genres, and description.
 * Supports swipe gestures on mobile and shows buttons on desktop.
 */

import { useSwipeable } from 'react-swipeable';
import Image from 'next/image';
import { Movie } from '@/lib/types';

interface MovieCardProps {
  movie: Movie;
  onSwipe: (choice: 'yes' | 'no') => void;
  isLoading?: boolean;
}

export default function MovieCard({ movie, onSwipe, isLoading = false }: MovieCardProps) {
  // Configure swipeable handlers for mobile gestures
  const handlers = useSwipeable({
    onSwipedLeft: () => !isLoading && onSwipe('no'),
    onSwipedRight: () => !isLoading && onSwipe('yes'),
    trackMouse: false, // Disable mouse tracking for desktop
    preventScrollOnSwipe: true,
  });

  return (
    <div
      {...handlers}
      className={`
        relative w-full max-w-md mx-auto
        bg-white rounded-2xl shadow-2xl overflow-hidden
        transform transition-all duration-300
        ${isLoading ? 'opacity-50 pointer-events-none' : 'hover:scale-105'}
      `}
    >
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] w-full bg-gray-200">
        {movie.poster_url ? (
          <Image
            src={movie.poster_url}
            alt={`${movie.title} poster`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 500px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
            <span className="text-6xl">🎬</span>
          </div>
        )}

        {/* Swipe hint overlay (subtle, only shows on mobile) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:hidden" />
      </div>

      {/* Movie Info */}
      <div className="p-6 bg-white">
        {/* Title and Year */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {movie.title}
        </h2>
        <p className="text-sm font-medium text-gray-500 mb-3">
          {movie.year}
        </p>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {movie.description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {movie.description}
          </p>
        )}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
