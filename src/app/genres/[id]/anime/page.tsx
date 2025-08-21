'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AnimeClient } from '../../../../../jikan-ts'
import { AnimeCard, GridLayout, Pagination } from '@/components'
import type { Anime } from '../../../../../jikan-ts/models'

interface AnimeSearchResult {
  data: Anime[]
  pagination: {
    last_visible_page: number
    has_next_page: boolean
    current_page: number
    items: {
      count: number
      total: number
      per_page: number
    }
  }
}

export default function GenreAnimePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const genreId = parseInt(params.id as string)
  
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>(null)
  
  const page = parseInt(searchParams.get('page') || '1')
  const orderBy = searchParams.get('order_by') || 'popularity'
  const sort = searchParams.get('sort') || 'asc'

  useEffect(() => {
    if (isNaN(genreId)) return

    const fetchAnime = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const animeClient = new AnimeClient({ enableLogging: false })
        const response = await animeClient.getAnimeSearch({
          genres: genreId.toString(),
          page: page,
          limit: 25,
          order_by: orderBy as any,
          sort: sort as any
        })

        setAnimeList(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error('Error fetching anime:', err)
        setError('Không thể tải danh sách anime. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnime()
  }, [genreId, page, orderBy, sort])

  const buildUrl = (newParams: Record<string, string | number>) => {
    const url = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      url.set(key, value.toString())
    })
    return `?${url.toString()}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">📺 Anime trong thể loại này</h2>
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
      {/* Header & Controls */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">📺 Anime trong thể loại này</h2>
            {pagination && (
              <p className="text-gray-600">
                Hiển thị {animeList.length} trong tổng số {pagination.items.total.toLocaleString()} anime
              </p>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex flex-wrap gap-3">
            <select
              value={orderBy}
              onChange={(e) => window.location.href = buildUrl({ order_by: e.target.value, page: '1' })}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="popularity">Phổ biến</option>
              <option value="start_date">Ngày phát sóng</option>
              <option value="title">Tên</option>
              <option value="score">Điểm đánh giá</option>
              <option value="members">Thành viên</option>
            </select>
            
            <select
              value={sort}
              onChange={(e) => window.location.href = buildUrl({ sort: e.target.value, page: '1' })}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {animeList.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy anime</h3>
          <p className="text-gray-600">Không có anime nào thuộc thể loại này.</p>
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
