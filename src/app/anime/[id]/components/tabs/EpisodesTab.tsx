"use client"
import { useState, useEffect } from 'react'
import { AnimeClient } from '@jikan-ts'
import type { AnimeEpisode } from '@jikan-ts/models'
import { EmptyState } from '@/components'

interface EpisodesTabProps {
  animeId: number
}

export function EpisodesTab({ animeId }: EpisodesTabProps) {
  const [episodes, setEpisodes] = useState<AnimeEpisode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true)
        const animeClient = new AnimeClient({ enableLogging: false })
        const response = await animeClient.getAnimeEpisodes(animeId)
        setEpisodes(response.data)
      } catch (err) {
        setError('Không thể tải danh sách tập phim')
        console.error('Error fetching episodes:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEpisodes()
  }, [animeId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon="❌"
        title="Lỗi tải dữ liệu"
        description={error}
      />
    )
  }

  if (episodes.length === 0) {
    return (
      <EmptyState
        icon="📺"
        title="Chưa có thông tin tập phim"
        description="Danh sách tập phim cho anime này chưa được cập nhật."
      />
    )
  }

  return (
    <div className="space-y-4">
      {episodes.map((episode: AnimeEpisode) => (
        <div key={episode.mal_id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Tập {episode.mal_id}
                </span>
                {episode.filler && (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                    Filler
                  </span>
                )}
                {episode.recap && (
                  <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">
                    Recap
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {episode.title}
              </h3>
              
              {episode.title_japanese && (
                <h4 className="text-md text-gray-600 mb-2">
                  {episode.title_japanese}
                </h4>
              )}
              
              {episode.title_romanji && (
                <h4 className="text-sm text-gray-500 mb-2">
                  {episode.title_romanji}
                </h4>
              )}
            </div>
            
            <div className="mt-4 md:mt-0 md:ml-6 text-right">
              {episode.aired && (
                <div className="text-sm text-gray-500">
                  Phát sóng: {new Date(episode.aired).toLocaleDateString('vi-VN')}
                </div>
              )}
              {episode.duration && (
                <div className="text-sm text-gray-600 mt-1">
                  ⏱️ {episode.duration} phút
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
