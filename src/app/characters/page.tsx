'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CharactersClient } from '../../../jikan-ts'
import { GridLayout, PaginationWrapper } from '@/components'
import type { Character } from '../../../jikan-ts/models'

interface CharacterCardProps {
  character: Character
}

function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link href={`/characters/${character.mal_id}`} className="group block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={character.images?.jpg?.image_url}
            alt={character.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {character.favorites && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md text-sm font-medium">
              ❤️ {character.favorites.toLocaleString()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {character.name}
          </h3>
          
          {character.name_kanji && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-1">{character.name_kanji}</p>
          )}

          <div className="text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>🆔 {character.mal_id}</span>
              {character.favorites && (
                <span>❤️ {character.favorites.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function CharactersPage() {
  const searchParams = useSearchParams()
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>(null)
  
  const page = parseInt(searchParams.get('page') || '1')
  const query = searchParams.get('q') || ''
  const orderBy = searchParams.get('order_by') || 'favorites'
  const sort = searchParams.get('sort') || 'desc'

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const charactersClient = new CharactersClient({ enableLogging: false })
        const response = await charactersClient.getCharacterSearch({
          q: query || undefined,
          page: page,
          limit: 25,
          order_by: orderBy as any,
          sort: sort as any
        })

        setCharacters(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error('Error fetching characters:', err)
        setError('Không thể tải danh sách nhân vật. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    fetchCharacters()
  }, [page, query, orderBy, sort])

  const buildUrl = (newParams: Record<string, string | number>) => {
    const url = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === '' || value === 'all') {
        url.delete(key)
      } else {
        url.set(key, value.toString())
      }
    })
    return `?${url.toString()}`
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchQuery = formData.get('search') as string
    window.location.href = buildUrl({ q: searchQuery, page: '1' })
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
              <span className="text-gray-700">Nhân vật</span>
            </nav>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">🎭 Nhân vật Anime</h1>
              <p className="text-lg text-gray-600">
                Khám phá các nhân vật anime nổi tiếng và được yêu thích nhất
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
            <span className="text-gray-700">Nhân vật</span>
          </nav>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🎭 Nhân vật Anime</h1>
            <p className="text-lg text-gray-600">
              Khám phá các nhân vật anime nổi tiếng và được yêu thích nhất
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                name="search"
                type="text"
                placeholder="Tìm kiếm nhân vật..."
                defaultValue={query}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {query ? `Kết quả tìm kiếm: "${query}"` : 'Tất cả nhân vật'}
              </h2>
              {pagination && (
                <p className="text-gray-600">
                  Hiển thị {characters.length} trong tổng số {pagination.items.total.toLocaleString()} nhân vật
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
                <option value="favorites">Yêu thích</option>
                <option value="name">Tên</option>
                <option value="mal_id">ID</option>
              </select>
              
              <select
                value={sort}
                onChange={(e) => window.location.href = buildUrl({ sort: e.target.value, page: '1' })}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="desc">Giảm dần</option>
                <option value="asc">Tăng dần</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {characters.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy nhân vật</h3>
            <p className="text-gray-600">
              {query ? `Không có nhân vật nào khớp với "${query}".` : 'Không có nhân vật nào.'}
            </p>
          </div>
        ) : (
          <>
            <GridLayout cols={{ sm: 2, md: 3, lg: 4, xl: 5 }}>
              {characters.map((character) => (
                <CharacterCard key={character.mal_id} character={character} />
              ))}
            </GridLayout>

            {/* Pagination */}
            {pagination && pagination.last_visible_page > 1 && (
              <div className="mt-8">
                <PaginationWrapper
                  currentPage={pagination.current_page}
                  totalPages={pagination.last_visible_page}
                  totalItems={pagination.items.total}
                  itemsPerPage={pagination.items.per_page}
                  onPageChange={(newPage: number) => {
                    window.location.href = buildUrl({ page: newPage })
                  }}
                  layout="split"
                  showInfo={true}
                  infoVariant="default"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
