"use client"

import { useState } from 'react'
import type { AnimeSearchParams, Genre } from '../../../jikan-ts'

interface AnimeFiltersProps {
  filters: AnimeSearchParams
  genres: Genre[]
  onFilterChange: (filters: Partial<AnimeSearchParams>) => void
  onClearFilters: () => void
}

export default function AnimeFilters({
  filters,
  genres,
  onFilterChange,
  onClearFilters
}: AnimeFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    filters.genres ? filters.genres.split(',') : []
  )

  const handleSearch = (query: string) => {
    onFilterChange({ q: query, page: 1 })
  }

  const handleFilterChange = (key: keyof AnimeSearchParams, value: any) => {
    onFilterChange({ [key]: value, page: 1 })
  }

  const handleGenreToggle = (genreId: string) => {
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId]
    
    setSelectedGenres(newSelectedGenres)
    onFilterChange({ 
      genres: newSelectedGenres.length > 0 ? newSelectedGenres.join(',') : undefined,
      page: 1
    })
  }

  const hasActiveFilters = () => {
    return filters.q || 
           filters.type || 
           filters.status || 
           filters.rating || 
           filters.order_by || 
           filters.min_score || 
           filters.max_score ||
           filters.genres ||
           filters.sort !== 'desc'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm anime..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.q || ''}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại anime
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="tv">TV</option>
            <option value="movie">Movie</option>
            <option value="ova">OVA</option>
            <option value="special">Special</option>
            <option value="ona">ONA</option>
            <option value="music">Music</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="airing">Đang phát</option>
            <option value="complete">Hoàn thành</option>
            <option value="upcoming">Sắp phát</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Độ tuổi
          </label>
          <select
            value={filters.rating || ''}
            onChange={(e) => handleFilterChange('rating', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="g">G - Mọi lứa tuổi</option>
            <option value="pg">PG - Trẻ em</option>
            <option value="pg13">PG-13 - Từ 13 tuổi</option>
            <option value="r17">R - Từ 17 tuổi</option>
            <option value="r">R+ - Từ 18 tuổi</option>
            <option value="rx">Rx - Hentai</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sắp xếp theo
          </label>
          <select
            value={filters.order_by || ''}
            onChange={(e) => handleFilterChange('order_by', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Mặc định</option>
            <option value="title">Tên A-Z</option>
            <option value="score">Điểm đánh giá</option>
            <option value="scored_by">Số lượt đánh giá</option>
            <option value="rank">Xếp hạng</option>
            <option value="popularity">Độ phổ biến</option>
            <option value="members">Số thành viên</option>
            <option value="favorites">Yêu thích</option>
            <option value="start_date">Ngày phát</option>
            <option value="end_date">Ngày kết thúc</option>
            <option value="episodes">Số tập</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <svg 
            className={`w-4 h-4 mr-1 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Bộ lọc nâng cao
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-6">
          {/* Score Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điểm tối thiểu
              </label>
              <input
                type="number"
                min="1"
                max="10"
                step="0.1"
                placeholder="1.0"
                value={filters.min_score || ''}
                onChange={(e) => handleFilterChange('min_score', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điểm tối đa
              </label>
              <input
                type="number"
                min="1"
                max="10"
                step="0.1"
                placeholder="10.0"
                value={filters.max_score || ''}
                onChange={(e) => handleFilterChange('max_score', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Thể loại ({selectedGenres.length} đã chọn)
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {genres.map((genre) => (
                    <label
                      key={genre.mal_id}
                      className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre.mal_id.toString())}
                        onChange={() => handleGenreToggle(genre.mal_id.toString())}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {genre.name}
                        <span className="text-xs text-gray-500 ml-1">
                          ({genre.count})
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bắt đầu từ
              </label>
              <input
                type="date"
                value={filters.start_date || ''}
                onChange={(e) => handleFilterChange('start_date', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày kết thúc đến
              </label>
              <input
                type="date"
                value={filters.end_date || ''}
                onChange={(e) => handleFilterChange('end_date', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sort Direction and Clear Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Thứ tự:</span>
            <select
              value={filters.sort || 'desc'}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Giảm dần</option>
              <option value="asc">Tăng dần</option>
            </select>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.sfw || false}
              onChange={(e) => handleFilterChange('sfw', e.target.checked)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Nội dung phù hợp</span>
          </label>
        </div>

        {hasActiveFilters() && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
          >
            Xóa tất cả bộ lọc
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Bộ lọc đang áp dụng:</span>
            {filters.q && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                "{filters.q}"
                <button
                  onClick={() => handleFilterChange('q', undefined)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {filters.type.toUpperCase()}
                <button
                  onClick={() => handleFilterChange('type', undefined)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {filters.status === 'airing' ? 'Đang phát' : 
                 filters.status === 'complete' ? 'Hoàn thành' : 'Sắp phát'}
                <button
                  onClick={() => handleFilterChange('status', undefined)}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedGenres.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {selectedGenres.length} thể loại
                <button
                  onClick={() => {
                    setSelectedGenres([])
                    handleFilterChange('genres', undefined)
                  }}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
