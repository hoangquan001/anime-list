"use client"
import { useState } from 'react'

interface ShareUrlProps {
  animeId: number
  activeTab: string
}

export function ShareUrl({ animeId, activeTab }: ShareUrlProps) {
  const [copied, setCopied] = useState(false)
  
  const getShareUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    return activeTab === 'overview' 
      ? `${baseUrl}/anime/${animeId}` 
      : `${baseUrl}/anime/${animeId}?tab=${activeTab}`
  }
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }
  
  return (
    <button
      onClick={copyToClipboard}
      className="ml-4 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors flex items-center space-x-1"
      title="Copy link to this tab"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
      </svg>
      <span>{copied ? 'Copied!' : 'Share'}</span>
    </button>
  )
}
