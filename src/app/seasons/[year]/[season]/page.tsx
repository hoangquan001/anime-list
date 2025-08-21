'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { SeasonsClient } from '../../../../../jikan-ts'
import { AnimeCard, GridLayout, Pagination } from '@/components'
import type { Anime, AnimeSeason } from '../../../../../jikan-ts/models'

export default function SpecificSeasonPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const year = parseInt(params.year as string)
  const season = params.season as AnimeSeason
  
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>(null)
  
  const page = parseInt(searchParams.get('page') || '1')
  const filter = searchParams.get('filter') || 'all'

  useEffect(() => {
    if (isNaN(year)) return

    const fetchSeasonAnime = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const seasonsClient = new SeasonsClient({ enableLogging: false })
        const response = await seasonsClient.getSeason(year, season, {
          page: page,
          limit: 25,
          filter: filter === 'all' ? undefined : filter as any
        })

        setAnimeList(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error('Error fetching season anime:', err)
        setError('Không thể tải danh sách anime. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    fetchSeasonAnime()
  }, [year, season, page, filter])

  const buildUrl = (newParams: Record<string, string | number>) => {
    const url = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      url.set(key, value.toString())
    })
    return `?${url.toString()}`
  }

  const getSeasonName = (season: string) => {
    const seasonNames = {
      'winter': 'Mùa đông',
      'spring': 'Mùa xuân',
      'summer': 'Mùa hè',
      'fall': 'Mùa thu'
    }
    return seasonNames[season as keyof typeof seasonNames] || season
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Anime {getSeasonName(season)} {year}
            </h2>
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
          </div>
        </div>

        {/* Loading Grid */}
        <GridLayout cols={{ sm: 2, md: 3, lg: 4, xl: 5 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="bg-gray-200 h-64"></div>
              <div className="p-4 space-y-3">
                <div className="bg-gray-200 h-4 rounded"></div>
                <div className="bg-gray-200 h-3 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </GridLayout>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😵</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi tải dữ liệu</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Anime {getSeasonName(season)} {year}
            </h2>
            {pagination && (
              <p className="text-gray-600">
                Hiển thị {animeList.length} trong tổng số {pagination.items.total.toLocaleString()} anime
              </p>
            )}
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filter}
              onChange={(e) => window.location.href = buildUrl({ filter: e.target.value, page: '1' })}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="tv">TV Series</option>
              <option value="movie">Movie</option>
              <option value="ova">OVA</option>
              <option value="special">Special</option>
              <option value="ona">ONA</option>
            </select>
          </div>
        </div>

        {/* Season Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {animeList.length}
            </div>
            <div className="text-sm text-gray-600">Anime hiện tại</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {animeList.filter(anime => anime.score).length}
            </div>
            <div className="text-sm text-gray-600">Có điểm đánh giá</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {animeList.filter(anime => anime.type === 'TV').length}
            </div>
            <div className="text-sm text-gray-600">TV Series</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {animeList.filter(anime => anime.type === 'Movie').length}
            </div>
            <div className="text-sm text-gray-600">Movies</div>
          </div>
        </div>
      </div>

      {/* Results */}
      {animeList.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy anime</h3>
          <p className="text-gray-600">
            Không có anime nào trong {getSeasonName(season)} {year}.
          </p>
        </div>
      ) : (
        <>
          <GridLayout cols={{ sm: 2, md: 3, lg: 4, xl: 5 }}>
            {animeList.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </GridLayout>

          {/* Pagination */}
          {pagination && pagination.last_visible_page > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.last_visible_page}
                onPageChange={(newPage: number) => {
                  window.location.href = buildUrl({ page: newPage })
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
