"use client"
import { useState, useEffect } from 'react'
import { AnimeClient } from '@jikan-ts'
import type { AnimeVideos } from '@jikan-ts/models'
import { EmptyState } from '@/components'

interface VideosTabProps {
  animeId: number
}

export function VideosTab({ animeId }: VideosTabProps) {
  const [videos, setVideos] = useState<AnimeVideos | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const animeClient = new AnimeClient({ enableLogging: false })
        const response = await animeClient.getAnimeVideos(animeId)
        setVideos(response.data)
      } catch (err) {
        setError('Không thể tải danh sách video')
        console.error('Error fetching videos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
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

  const hasVideos = videos && (
    (videos.promo && videos.promo.length > 0) ||
    (videos.episodes && videos.episodes.length > 0) ||
    (videos.music_videos && videos.music_videos.length > 0)
  )

  if (!hasVideos) {
    return (
      <EmptyState
        icon="🎬"
        title="Chưa có video"
        description="Chưa có video nào được cập nhật cho anime này."
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Promo Videos */}
      {videos?.promo && videos.promo.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Trailer & Promo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.promo.map((video: any, index: number) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  {video.trailer?.images?.maximum_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={video.trailer.images.maximum_image_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a
                      href={video.trailer?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-1">{video.title}</h4>
                  <p className="text-sm text-gray-600">{video.trailer?.url && 'YouTube'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Music Videos */}
      {videos?.music_videos && videos.music_videos.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Music Videos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.music_videos.map((video: any, index: number) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a
                      href={video.video?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-1">{video.title}</h4>
                  <div className="space-y-1">
                    {video.meta?.author && (
                      <p className="text-sm text-gray-600">Tác giả: {video.meta.author}</p>
                    )}
                    {video.meta?.title && (
                      <p className="text-sm text-gray-600">Bài hát: {video.meta.title}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Episode Videos */}
      {videos?.episodes && videos.episodes.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Episodes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.episodes.map((video: any, index: number) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-1">{video.title}</h4>
                  <p className="text-sm text-gray-600">Episode {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
