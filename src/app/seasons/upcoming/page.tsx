'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SeasonsClient } from '../../../../jikan-ts'
import { AnimeCard, GridLayout, Pagination } from '@/components'
import type { Anime } from '../../../../jikan-ts/models'

export default function SeasonUpcomingPage() {
  const searchParams = useSearchParams()
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>(null)
  
  const page = parseInt(searchParams.get('page') || '1')
  const filter = searchParams.get('filter') || 'all'

  useEffect(() => {
    const fetchUpcomingSeason = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const seasonsClient = new SeasonsClient({ enableLogging: false })
        const response = await seasonsClient.getSeasonUpcoming({
          page: page,
          limit: 25,
          filter: filter === 'all' ? undefined : filter as any
        })

        setAnimeList(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error('Error fetching upcoming season:', err)
        setError('Không thể tải danh sách anime sắp chiếu. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingSeason()
  }, [page, filter])

  const buildUrl = (newParams: Record<string, string | number>) => {
    const url = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      url.set(key, value.toString())
    })
    return `?${url.toString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-8">
            <nav className="mb-6">
              <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                Trang chủ
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/seasons" className="text-blue-600 hover:text-blue-800 transition-colors">
                Mùa phim
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">Sắp chiếu</span>
            </nav>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">🔮 Anime sắp chiếu</h1>
              <p className="text-lg text-gray-600">
                Những anime được mong chờ nhất trong tương lai
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
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
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <nav className="mb-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              Trang chủ
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/seasons" className="text-blue-600 hover:text-blue-800 transition-colors">
              Mùa phim
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">Sắp chiếu</span>
          </nav>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🔮 Anime sắp chiếu</h1>
            <p className="text-lg text-gray-600">
              Những anime được mong chờ nhất trong tương lai
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Anime sắp ra mắt</h2>
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
        </div>

        {/* Results */}
        {animeList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy anime</h3>
            <p className="text-gray-600">Không có anime nào sắp chiếu.</p>
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
              <div className="flex justify-center mt-8">
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
    </div>
  )
}
