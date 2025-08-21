"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimeClient } from '@jikan-ts'
import type { Recommendation } from '@jikan-ts/models'
import { EmptyState } from '@/components'

interface RecommendationsTabProps {
  animeId: number
}

export function RecommendationsTab({ animeId }: RecommendationsTabProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        const animeClient = new AnimeClient({ enableLogging: false })
        const response = await animeClient.getAnimeRecommendations(animeId)
        setRecommendations(response.data)
      } catch (err) {
        setError('Không thể tải danh sách gợi ý')
        console.error('Error fetching recommendations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
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

  if (recommendations.length === 0) {
    return (
      <EmptyState
        icon="💡"
        title="Chưa có gợi ý"
        description="Chưa có anime nào được gợi ý cho series này."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recommendations.map((recommendation: Recommendation, index: number) => (
        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <Link href={`/anime/${recommendation.entry.mal_id}`}>
            <div className="aspect-[3/4] bg-gray-200">
              {recommendation.entry.images?.jpg?.large_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={recommendation.entry.images.jpg.large_image_url}
                  alt={recommendation.entry.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                {recommendation.entry.title}
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Được gợi ý</span>
                {recommendation.entry.url && (
                  <span className="text-blue-600">Xem chi tiết →</span>
                )}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
