'use client'

import { useState, useEffect } from 'react'
import { CharactersClient } from '../../../../../jikan-ts'
import { GridLayout } from '@/components'
import type { CharacterVoiceActor } from '../../../../../jikan-ts/models'

interface CharacterVoicesTabProps {
  characterId: number
}

export default function CharacterVoicesTab({ characterId }: CharacterVoicesTabProps) {
  const [voiceActors, setVoiceActors] = useState<CharacterVoiceActor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCharacterVoices = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const charactersClient = new CharactersClient({ enableLogging: false })
        const response = await charactersClient.getCharacterVoiceActors(characterId)
        setVoiceActors(response.data)
      } catch (err) {
        console.error('Error fetching character voices:', err)
        setError('Không thể tải danh sách lồng tiếng. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    fetchCharacterVoices()
  }, [characterId])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🎤 Lồng tiếng</h2>
        <GridLayout cols={{ sm: 1, md: 2, lg: 3 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-50 rounded-lg p-4">
              <div className="flex space-x-4">
                <div className="bg-gray-200 w-16 h-20 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </GridLayout>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🎤 Lồng tiếng</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">😵</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🎤 Lồng tiếng ({voiceActors.length})</h2>
      
      {voiceActors.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎤</div>
          <p className="text-gray-600">Chưa có thông tin về diễn viên lồng tiếng.</p>
        </div>
      ) : (
        <GridLayout cols={{ sm: 1, md: 2, lg: 3 }}>
          {voiceActors.map((va, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={va.person.images?.jpg?.image_url}
                    alt={va.person.name}
                    className="w-16 h-20 object-cover rounded"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
                    {va.person.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Ngôn ngữ: <span className="font-medium">{va.language}</span>
                  </p>
                  <div className="text-xs text-gray-500">
                    ID: {va.person.mal_id}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </GridLayout>
      )}
    </div>
  )
}
