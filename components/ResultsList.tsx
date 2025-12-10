/**
 * ResultsList Component
 *
 * Displays the list of matched movies that both users liked
 */

import Image from 'next/image';
import { Movie } from '@/lib/types';

interface ResultsListProps {
  matches: Movie[];
  sessionId: string;
}

export default function ResultsList({ matches, sessionId }: ResultsListProps) {
  if (matches.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">😢</div>
        <h3 className="text-2xl font-bold text-white mb-4">
          No Matches Found
        </h3>
        <p className="text-white/80 mb-8">
          You didn&apos;t both like any of the same movies. Try again with a new session!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">
          🎉 You Both Liked These!
        </h2>
        <p className="text-white/80 text-lg">
          {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
        </p>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {matches.map((movie) => (
          <div
            key={movie.id}
            className="
              bg-white rounded-lg shadow-lg overflow-hidden
              transform transition-all duration-200
              hover:scale-105 hover:shadow-xl
            "
          >
            {/* Movie Poster */}
            <div className="relative aspect-[2/3] bg-gray-200">
              {movie.poster_url ? (
                <Image
                  src={movie.poster_url}
                  alt={`${movie.title} poster`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                  <span className="text-4xl">🎬</span>
                </div>
              )}
            </div>

            {/* Movie Info */}
            <div className="p-3">
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                {movie.title}
              </h3>
              <p className="text-xs text-gray-500">
                {movie.year}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
