"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import type { Anime } from '@jikan-ts/models'
import { OverviewTab } from './tabs/OverviewTab'
import { CharactersTab } from './tabs/CharactersTab'
import { StaffTab } from './tabs/StaffTab'
import { EpisodesTab } from './tabs/EpisodesTab'
import { VideosTab } from './tabs/VideosTab'
import { PicturesTab } from './tabs/PicturesTab'
import { StatisticsTab } from './tabs/StatisticsTab'
import { RecommendationsTab } from './tabs/RecommendationsTab'
import { ShareUrl } from './ShareUrl'

interface TabContentProps {
  anime: Anime
  animeId: number
}

export function TabContent({ anime, animeId }: TabContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'characters', label: 'Nhân vật' },
    { id: 'staff', label: 'Staff' },
    { id: 'episodes', label: 'Tập phim' },
    { id: 'videos', label: 'Video' },
    { id: 'pictures', label: 'Hình ảnh' },
    { id: 'statistics', label: 'Thống kê' },
    { id: 'recommendations', label: 'Gợi ý' },
  ]

  const handleTabChange = useCallback((tabId: string) => {
    const url = tabId === 'overview' 
      ? `/anime/${animeId}` 
      : `/anime/${animeId}?tab=${tabId}`
    router.push(url)
  }, [router, animeId])

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      // This will be triggered by Next.js router when user uses back/forward
      // The activeTab will automatically update from searchParams
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return // Don't interfere with browser shortcuts
      
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
      
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault()
        handleTabChange(tabs[currentIndex - 1].id)
      } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
        e.preventDefault()
        handleTabChange(tabs[currentIndex + 1].id)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTab, tabs, handleTabChange])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab anime={anime} />
      case 'characters':
        return <CharactersTab animeId={animeId} />
      case 'staff':
        return <StaffTab animeId={animeId} />
      case 'episodes':
        return <EpisodesTab animeId={animeId} />
      case 'videos':
        return <VideosTab animeId={animeId} />
      case 'pictures':
        return <PicturesTab animeId={animeId} />
      case 'statistics':
        return <StatisticsTab animeId={animeId} />
      case 'recommendations':
        return <RecommendationsTab animeId={animeId} />
      default:
        // If invalid tab, redirect to overview
        if (activeTab !== 'overview') {
          router.replace(`/anime/${animeId}`)
        }
        return <OverviewTab anime={anime} />
    }
  }

  return (
    <>
      {/* Tab Navigation */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <ShareUrl animeId={animeId} activeTab={activeTab} />
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {renderTabContent()}
      </div>
    </>
  )
}
