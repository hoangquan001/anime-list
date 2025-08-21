"use client"

import type { Anime } from '../../../jikan-ts'

interface AnimeListViewProps {
  anime: Anime
  className?: string
}

export default function AnimeListView({ anime, className = '' }: AnimeListViewProps) {
  const img = anime.images.webp?.image_url || anime.images.jpg.image_url
  
  return (
    <div className={`flex bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 ${className}`}>
      {/* Image */}
      <div className="flex-shrink-0 w-20 h-28 bg-gray-200 rounded-lg overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={anime.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
            🎌
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 ml-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
            <a href={`/anime/${anime.mal_id}`} className="hover:underline">
              {anime.title}
            </a>
          </h3>
          <div className="flex items-center gap-2 ml-4">
            {anime.score && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                ⭐ {anime.score}
              </span>
            )}
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {anime.type}
            </span>
          </div>
        </div>

        {/* Genres */}
        {anime.genres && anime.genres.length > 0 && (
          <div className="mb-2">
            <div className="flex flex-wrap gap-1">
              {anime.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre.mal_id}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {genre.name}
                </span>
              ))}
              {anime.genres.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                  +{anime.genres.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Synopsis */}
        {anime.synopsis && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
            {anime.synopsis}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{anime.episodes ? `${anime.episodes} tập` : "? tập"}</span>
          <span>•</span>
          <span>{anime.status}</span>
          {anime.year && (
            <>
              <span>•</span>
              <span>{anime.year}</span>
            </>
          )}
          {anime.members && (
            <>
              <span>•</span>
              <span>{anime.members.toLocaleString()} thành viên</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
