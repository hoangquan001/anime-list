"use client"
import { useState, useEffect } from 'react'
import { AnimeClient } from '@jikan-ts'
import type { AnimeStatistics } from '@jikan-ts/models'
import { EmptyState, ScoreDistribution } from '@/components'

interface StatisticsTabProps {
  animeId: number
}

export function StatisticsTab({ animeId }: StatisticsTabProps) {
  const [statistics, setStatistics] = useState<AnimeStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true)
        const animeClient = new AnimeClient({ enableLogging: false })
        const response = await animeClient.getAnimeStatistics(animeId)
        setStatistics(response.data)
      } catch (err) {
        setError('Không thể tải thống kê')
        console.error('Error fetching statistics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStatistics()
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

  if (!statistics) {
    return (
      <EmptyState
        icon="📊"
        title="Chưa có thống kê"
        description="Thống kê cho anime này chưa được cập nhật."
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Watching Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold mb-6">Thống kê người xem</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {statistics.watching?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-600">Đang xem</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {statistics.completed?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-600">Đã hoàn thành</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {statistics.on_hold?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-600">Tạm dừng</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {statistics.dropped?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-600">Đã bỏ</div>
          </div>
        </div>
      </div>

      {/* Score Distribution */}
      {statistics.scores && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-6">Phân bố điểm số</h3>
          <ScoreDistribution 
            scores={statistics.scores} 
            total={statistics.scores.reduce((sum, score) => sum + score.votes, 0)}
          />
        </div>
      )}

      {/* Additional Stats */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold mb-6">Thống kê tổng quan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Người dùng</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng thành viên:</span>
                <span className="font-medium">
                  {(
                    (statistics.watching || 0) +
                    (statistics.completed || 0) +
                    (statistics.on_hold || 0) +
                    (statistics.dropped || 0) +
                    (statistics.plan_to_watch || 0)
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dự định xem:</span>
                <span className="font-medium">{statistics.plan_to_watch?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Tỷ lệ hoàn thành</h4>
            <div className="space-y-2">
              {statistics.completed && statistics.watching && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tỷ lệ hoàn thành:</span>
                  <span className="font-medium">
                    {(
                      (statistics.completed / 
                      (statistics.watching + statistics.completed + (statistics.on_hold || 0) + (statistics.dropped || 0))) * 100
                    ).toFixed(1)}%
                  </span>
                </div>
              )}
              {statistics.dropped && statistics.watching && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tỷ lệ bỏ:</span>
                  <span className="font-medium">
                    {(
                      (statistics.dropped / 
                      (statistics.watching + statistics.completed + (statistics.on_hold || 0) + statistics.dropped)) * 100
                    ).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
