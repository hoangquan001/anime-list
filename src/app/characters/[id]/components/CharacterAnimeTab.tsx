'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CharactersClient } from '../../../../../jikan-ts'
import { GridLayout } from '@/components'
import type { CharacterAnime } from '../../../../../jikan-ts/models'

interface CharacterAnimeTabProps {
  characterId: number
}

export default function CharacterAnimeTab({ characterId }: CharacterAnimeTabProps) {
  const [animeList, setAnimeList] = useState<CharacterAnime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCharacterAnime = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const charactersClient = new CharactersClient({ enableLogging: false })
        const response = await charactersClient.getCharacterAnime(characterId)
        setAnimeList(response.data)
      } catch (err) {
        console.error('Error fetching character anime:', err)
        setError('Không thể tải danh sách anime. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    fetchCharacterAnime()
  }, [characterId])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📺 Anime</h2>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📺 Anime</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">😵</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📺 Anime ({animeList.length})</h2>
      
      {animeList.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📺</div>
          <p className="text-gray-600">Nhân vật này chưa xuất hiện trong anime nào.</p>
        </div>
      ) : (
        <GridLayout cols={{ sm: 1, md: 2, lg: 3 }}>
          {animeList.map((characterAnime) => (
            <Link
              key={characterAnime.anime.mal_id}
              href={`/anime/${characterAnime.anime.mal_id}`}
              className="group block"
            >
              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={characterAnime.anime.images?.jpg?.small_image_url || characterAnime.anime.images?.jpg?.image_url}
                      alt={characterAnime.anime.title}
                      className="w-16 h-20 object-cover rounded"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {characterAnime.anime.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Vai trò: <span className="font-medium">{characterAnime.role}</span>
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>ID: {characterAnime.anime.mal_id}</span>
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
