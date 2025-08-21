'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface GenreNavProps {
  genreId: number
}

export function GenreNav({ genreId }: GenreNavProps) {
  const pathname = usePathname()
  const isAnimePage = pathname.includes('/anime')
  const isMangaPage = pathname.includes('/manga')
  
  return (
    <nav className="flex bg-gray-100 rounded-lg p-1">
      <Link
        href={`/genres/${genreId}/anime`}
        className={`px-6 py-3 rounded-md font-medium transition-colors ${
          isAnimePage
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-700 hover:bg-white hover:shadow-sm'
        }`}
      >
        📺 Anime
      </Link>
      <Link
        href={`/genres/${genreId}/manga`}
        className={`px-6 py-3 rounded-md font-medium transition-colors ${
          isMangaPage
            ? 'bg-purple-600 text-white shadow-sm'
            : 'text-gray-700 hover:bg-white hover:shadow-sm'
        }`}
      >
        📚 Manga
      </Link>
    </nav>
  )
}
