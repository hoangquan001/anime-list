"use client"
import Image from "next/image"
import Link from "next/link"
import type { Anime } from "@jikan-ts"

interface AnimeCardProps {
  anime: Anime
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'aspect-[3/4]',
  md: 'aspect-[3/4]', 
  lg: 'aspect-[3/4]'
}

export default function AnimeCard({ 
  anime, 
  size = 'md',
  showDetails = true,
  className = ''
}: AnimeCardProps) {
  const img = anime.images.webp?.image_url || anime.images.jpg.image_url
  
  return (
    <Link
      href={`/anime/${anime.mal_id}`}
      className={`group block rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 ${className}`}
    >
      <div className={`${sizeClasses[size]} relative bg-gray-200`}>
        {img ? (
          <Image
            src={img}
            alt={anime.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
            className="object-cover group-hover:opacity-95 transition-opacity"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-4xl">🎌</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        {/* Type badge */}
        <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full bg-blue-600 text-white font-medium">
          {anime.type}
        </span>
        
        {/* Score badge */}
        {anime.score && (
          <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-yellow-500 text-white font-medium">
            ⭐ {anime.score}
          </span>
        )}
      </div>
      
      {showDetails && (
        <div className="p-3">
          <h3 className="text-sm font-semibold line-clamp-2 text-gray-800 group-hover:text-blue-600 transition-colors">
            {anime.title}
          </h3>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
            <span>{anime.episodes ?? "?"} tập</span>
            <span>{anime.status}</span>
          </div>
          {anime.year && (
            <div className="text-xs text-gray-500 mt-1">
              {anime.year}
            </div>
          )}
        </div>
      )}
    </Link>
  )
}
