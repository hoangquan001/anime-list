'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CharactersClient } from '../../../../../jikan-ts'
import { GridLayout } from '@/components'
import type { CharacterManga } from '../../../../../jikan-ts/models'

interface CharacterMangaTabProps {
  characterId: number
}

export default function CharacterMangaTab({ characterId }: CharacterMangaTabProps) {
  const [mangaList, setMangaList] = useState<CharacterManga[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCharacterManga = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const charactersClient = new CharactersClient({ enableLogging: false })
        const response = await charactersClient.getCharacterManga(characterId)
        setMangaList(response.data)
      } catch (err) {
        console.error('Error fetching character manga:', err)
        setError('Không thể tải danh sách manga. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    fetchCharacterManga()
  }, [characterId])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📚 Manga</h2>
        <GridLayout cols={{ sm: 2, md: 3, lg: 4 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-lg mb-3"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded w-3/4"></div>
            </div>
          ))}
        </GridLayout>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📚 Manga</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">😵</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📚 Manga ({mangaList.length})</h2>
      
      {mangaList.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-600">Nhân vật này chưa xuất hiện trong manga nào.</p>
        </div>
      ) : (
        <GridLayout cols={{ sm: 1, md: 2, lg: 3 }}>
          {mangaList.map((characterManga) => (
            <Link
              key={characterManga.manga.mal_id}
              href={`/manga/${characterManga.manga.mal_id}`}
              className="group block"
            >
              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={characterManga.manga.images?.jpg?.small_image_url || characterManga.manga.images?.jpg?.image_url}
                      alt={characterManga.manga.title}
                      className="w-16 h-20 object-cover rounded"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {characterManga.manga.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Vai trò: <span className="font-medium">{characterManga.role}</span>
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>ID: {characterManga.manga.mal_id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </GridLayout>
      )}
    </div>
  )
}
