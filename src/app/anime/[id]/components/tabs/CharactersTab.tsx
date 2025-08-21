"use client"
import { useState, useEffect } from 'react'
import { AnimeClient } from '@jikan-ts'
import type { AnimeCharacter } from '@jikan-ts/models'
import { 
  CharacterCard, 
  GridLayout,
  EmptyState 
} from '@/components'

interface CharactersTabProps {
  animeId: number
}

export function CharactersTab({ animeId }: CharactersTabProps) {
  const [characters, setCharacters] = useState<AnimeCharacter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true)
        const animeClient = new AnimeClient({ enableLogging: false })
        const response = await animeClient.getAnimeCharacters(animeId)
        setCharacters(response.data)
      } catch (err) {
        setError('Không thể tải danh sách nhân vật')
        console.error('Error fetching characters:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCharacters()
  }, [animeId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon="❌"
        title="Lỗi tải dữ liệu"
        description={error}
      />
    )
  }

  if (characters.length === 0) {
    return (
      <EmptyState
        icon="🎭"
        title="Chưa có thông tin nhân vật"
        description="Thông tin nhân vật cho anime này chưa được cập nhật."
      />
    )
  }

  return (
    <GridLayout cols={{ sm: 1, md: 2, lg: 3, xl: 4 }}>
      {characters.map((character: AnimeCharacter) => (
        <CharacterCard 
          key={character.character.mal_id} 
          character={character}
        />
      ))}
    </GridLayout>
  )
}
