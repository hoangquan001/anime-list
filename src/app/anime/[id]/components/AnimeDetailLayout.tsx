"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Anime } from '@jikan-ts/models'
import { Breadcrumb } from './Breadcrumb'

interface AnimeDetailLayoutProps {
  anime: Anime
  children: React.ReactNode
}

export function AnimeDetailLayout({ anime, children }: AnimeDetailLayoutProps) {
  const pathname = usePathname()
  
  const tabs = [
    { id: 'overview', label: 'Tổng quan', path: `/anime/${anime.mal_id}` },
    { id: 'characters', label: 'Nhân vật', path: `/anime/${anime.mal_id}/characters` },
    { id: 'staff', label: 'Staff', path: `/anime/${anime.mal_id}/staff` },
    { id: 'episodes', label: 'Tập phim', path: `/anime/${anime.mal_id}/episodes` },
    { id: 'videos', label: 'Video', path: `/anime/${anime.mal_id}/videos` },
    { id: 'pictures', label: 'Hình ảnh', path: `/anime/${anime.mal_id}/pictures` },
    { id: 'statistics', label: 'Thống kê', path: `/anime/${anime.mal_id}/statistics` },
    { id: 'recommendations', label: 'Gợi ý', path: `/anime/${anime.mal_id}/recommendations` },
  ]

  // Determine current tab based on pathname
  const getCurrentTab = () => {
    const currentTab = tabs.find(tab => tab.path === pathname)
    return currentTab || tabs[0] // Default to overview
  }

  const currentTab = getCurrentTab()

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Anime', href: '/anime' },
    { label: anime.title, href: currentTab.id === 'overview' ? undefined : `/anime/${anime.mal_id}` },
    ...(currentTab.id !== 'overview' ? [{ label: currentTab.label, active: true }] : [])
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          {anime.images.jpg.large_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={anime.images.jpg.large_image_url} 
              alt={anime.title}
              className="w-full h-full object-cover opacity-20 blur-sm"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90" />
        </div>
        
        <div className="relative container mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Poster */}
            <div className="lg:col-span-3">
              <div className="sticky top-8">
                {anime.images.jpg.large_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={anime.images.jpg.large_image_url} 
                    alt={anime.title}
                    className="w-full max-w-sm mx-auto rounded-xl shadow-2xl"
                  />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-9">
              <h1 className="text-4xl font-bold mb-4">{anime.title}</h1>
              {anime.title_english && anime.title_english !== anime.title && (
                <h2 className="text-2xl text-blue-200 mb-2">{anime.title_english}</h2>
              )}
              {anime.title_japanese && (
                <h3 className="text-xl text-blue-300 mb-6">{anime.title_japanese}</h3>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {anime.score || 'N/A'}
                  </div>
                  <div className="text-sm text-blue-200">Điểm số</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    #{anime.rank || 'N/A'}
                  </div>
                  <div className="text-sm text-blue-200">Xếp hạng</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {anime.episodes || '?'}
                  </div>
                  <div className="text-sm text-blue-200">Tập</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {anime.status}
                  </div>
                  <div className="text-sm text-blue-200">Trạng thái</div>
                </div>
              </div>

              {anime.synopsis && (
                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-3">Tóm tắt</h4>
                  <p className="text-blue-100 leading-relaxed">
                    {anime.synopsis}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.path}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  pathname === tab.path
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
