'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MangaClient } from '../../../../../jikan-ts'
import { GridLayout, Pagination } from '@/components'
import type { Manga } from '../../../../../jikan-ts/models'

interface MangaSearchResult {
  data: Manga[]
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

interface MangaCardProps {
  manga: Manga
}

function MangaCard({ manga }: MangaCardProps) {
  const statusColors = {
    'Publishing': 'bg-green-100 text-green-800',
    'Finished': 'bg-blue-100 text-blue-800',
    'On Hiatus': 'bg-yellow-100 text-yellow-800',
    'Discontinued': 'bg-red-100 text-red-800',
    'Not yet published': 'bg-gray-100 text-gray-800'
  }

  return (
    <Link href={`/manga/${manga.mal_id}`} className="group block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url}
            alt={manga.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {manga.score && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md text-sm font-medium">
              ⭐ {manga.score}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {manga.title}
          </h3>
          
          {manga.title_english && manga.title_english !== manga.title && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-1">{manga.title_english}</p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {manga.status && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[manga.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                {manga.status}
              </span>
            )}
            {manga.type && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                {manga.type}
              </span>
            )}
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            {manga.chapters && (
              <div>📖 {manga.chapters} chương</div>
            )}
            {manga.volumes && (
              <div>📚 {manga.volumes} tập</div>
            )}
            {manga.members && (
              <div>👥 {manga.members.toLocaleString()} thành viên</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function GenreMangaPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const genreId = parseInt(params.id as string)
  
  const [mangaList, setMangaList] = useState<Manga[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>(null)
  
  const page = parseInt(searchParams.get('page') || '1')
  const orderBy = searchParams.get('order_by') || 'popularity'
  const sort = searchParams.get('sort') || 'asc'

  useEffect(() => {
    if (isNaN(genreId)) return

    const fetchManga = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const mangaClient = new MangaClient({ enableLogging: false })
        const response = await mangaClient.getMangaSearch({
          genres: genreId.toString(),
          page: page,
          limit: 25,
          order_by: orderBy as any,
          sort: sort as any
        })

        setMangaList(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error('Error fetching manga:', err)
        setError('Không thể tải danh sách manga. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    fetchManga()
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
            <h2 className="text-2xl font-bold text-gray-800">📚 Manga trong thể loại này</h2>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">📚 Manga trong thể loại này</h2>
            {pagination && (
              <p className="text-gray-600">
                Hiển thị {mangaList.length} trong tổng số {pagination.items.total.toLocaleString()} manga
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
              <option value="start_date">Ngày phát hành</option>
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
      {mangaList.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy manga</h3>
          <p className="text-gray-600">Không có manga nào thuộc thể loại này.</p>
        </div>
      ) : (
        <>
          <GridLayout cols={{ sm: 2, md: 3, lg: 4, xl: 5 }}>
            {mangaList.map((manga) => (
              <MangaCard key={manga.mal_id} manga={manga} />
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
