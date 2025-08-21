'use client'

import { useState, useEffect } from 'react'
import { CharactersClient } from '../../../../../jikan-ts'
import { GridLayout } from '@/components'
import type { JikanImagesCollection } from '../../../../../jikan-ts/models'

interface CharacterPicturesTabProps {
  characterId: number
}

export default function CharacterPicturesTab({ characterId }: CharacterPicturesTabProps) {
  const [pictures, setPictures] = useState<JikanImagesCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchCharacterPictures = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const charactersClient = new CharactersClient({ enableLogging: false })
        const response = await charactersClient.getCharacterPictures(characterId)
        setPictures(response.data)
      } catch (err) {
        console.error('Error fetching character pictures:', err)
        setError('Không thể tải hình ảnh. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    fetchCharacterPictures()
  }, [characterId])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🖼️ Hình ảnh</h2>
        <GridLayout cols={{ sm: 2, md: 3, lg: 4, xl: 5 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-[3/4] rounded-lg"></div>
            </div>
          ))}
        </GridLayout>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🖼️ Hình ảnh</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">😵</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🖼️ Hình ảnh ({pictures.length})</h2>
        
        {pictures.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🖼️</div>
            <p className="text-gray-600">Chưa có hình ảnh nào cho nhân vật này.</p>
          </div>
        ) : (
          <GridLayout cols={{ sm: 2, md: 3, lg: 4, xl: 5 }}>
            {pictures.map((picture, index) => (
              <div key={index} className="group cursor-pointer">
                <div 
                  className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100"
                  onClick={() => setSelectedImage(picture.image_url)}
                >
                  <img
                    src={picture.small_image_url || picture.image_url}
                    alt={`Character picture ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 text-white text-2xl">
                      🔍
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </GridLayout>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-colors z-10"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Character picture"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}
