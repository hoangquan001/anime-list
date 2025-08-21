"use client"

import { useState, useEffect, useMemo } from 'react'
import { JikanClient } from '../../../jikan-ts/clients/jikan.client'
import type { Anime, AnimeSearchParams, Genre } from '../../../jikan-ts'
import AnimeCard from '@/components/AnimeCard'
import { Pagination } from '@/components/ui/Pagination'
import AnimeFilters from '@/components/anime/AnimeFilters'
import AnimeListView from '@/components/anime/AnimeListView'
import { AnimeCardSkeleton, AnimeListSkeleton } from '@/components/ui/Skeleton'

type ViewMode = 'grid' | 'list'

interface AnimePageState {
  animes: Anime[]
  genres: Genre[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  totalItems: number
  filters: AnimeSearchParams
  viewMode: ViewMode
}

const ITEMS_PER_PAGE = 25

// Initialize Jikan client
const jikan = new JikanClient()

export default function AnimePage() {
  // Initialize view mode from localStorage
  const [state, setState] = useState<AnimePageState>({
    animes: [],
    genres: [],
    loading: true,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    viewMode: 'grid',
    filters: {
      limit: ITEMS_PER_PAGE,
      page: 1,
      sfw: true
    }
  })

  // Load view mode preference from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('anime-view-mode') as ViewMode
    if (savedViewMode && (savedViewMode === 'grid' || savedViewMode === 'list')) {
      setState(prev => ({ ...prev, viewMode: savedViewMode }))
    }
  }, [])

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await jikan.genres.getAnimeGenres()
        setState(prev => ({
          ...prev,
          genres: genresData.data || []
        }))
      } catch (error) {
        console.error('Failed to fetch genres:', error)
      }
    }
    fetchGenres()
  }, [])

  // Fetch anime data when filters change
  useEffect(() => {
    const fetchAnime = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const response = await jikan.anime.getAnimeSearch(state.filters)
        setState(prev => ({
          ...prev,
          animes: response.data || [],
          totalPages: response.pagination?.last_visible_page || 1,
          totalItems: response.pagination?.items?.total || 0,
          loading: false
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Có lỗi xảy ra khi tải dữ liệu anime',
          loading: false
        }))
        console.error('Failed to fetch anime:', error)
      }
    }

    fetchAnime()
  }, [state.filters])

  // Update filters
  const updateFilters = (newFilters: Partial<AnimeSearchParams>) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        ...newFilters,
        page: newFilters.page || 1
      },
      currentPage: newFilters.page || 1
    }))
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    updateFilters({ page })
  }

  // Clear all filters
  const clearFilters = () => {
    setState(prev => ({
      ...prev,
      filters: {
        limit: ITEMS_PER_PAGE,
        page: 1,
        sfw: true
      },
      currentPage: 1
    }))
  }

  // Handle view mode change
  const handleViewModeChange = (viewMode: ViewMode) => {
    setState(prev => ({ ...prev, viewMode }))
    localStorage.setItem('anime-view-mode', viewMode)
  }

  const filteredGenres = useMemo(() => {
    return state.genres.filter(genre => genre.count > 0)
  }, [state.genres])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Danh sách Anime
          </h1>
          <p className="text-gray-600">
            Khám phá thế giới anime phong phú với hàng nghìn bộ anime hay nhất
          </p>
        </div>

        {/* Filters */}
        <AnimeFilters
          filters={state.filters}
          genres={filteredGenres}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
        />

        {/* Results Info and View Mode */}
        {!state.loading && (
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-600">
              Hiển thị {state.animes.length} trên {state.totalItems} kết quả
              {state.filters.q && (
                <span className="ml-2">
                  cho "<span className="font-medium text-gray-900">{state.filters.q}</span>"
                </span>
              )}
            </div>
            
            {/* View Mode Selector */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  state.viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Xem dạng lưới"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  state.viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Xem dạng danh sách"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {state.loading && (
          <>
            {state.viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
                {Array.from({ length: 24 }).map((_, index) => (
                  <AnimeCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {Array.from({ length: 10 }).map((_, index) => (
                  <AnimeListSkeleton key={index} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Error State */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{state.error}</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!state.loading && !state.error && state.animes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎌</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Không tìm thấy anime nào
            </h3>
            <p className="text-gray-500 mb-6">
              Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Anime Display */}
        {!state.loading && !state.error && state.animes.length > 0 && (
          <>
            {state.viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
                {state.animes.map((anime) => (
                  <AnimeCard
                    key={anime.mal_id}
                    anime={anime}
                    size="md"
                    showDetails={true}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {state.animes.map((anime) => (
                  <AnimeListView
                    key={anime.mal_id}
                    anime={anime}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center">
              <Pagination
                currentPage={state.currentPage}
                totalPages={state.totalPages}
                onPageChange={handlePageChange}
                showInfo={true}
                totalItems={state.totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                variant="default"
                size="md"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
