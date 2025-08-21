"use client"
import { useState, useEffect } from 'react'
import { AnimeClient } from '@jikan-ts'
import type { AnimePicture } from '@jikan-ts/models'
import { EmptyState } from '@/components'

interface PicturesTabProps {
  animeId: number
}

export function PicturesTab({ animeId }: PicturesTabProps) {
  const [pictures, setPictures] = useState<AnimePicture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        setLoading(true)
        const animeClient = new AnimeClient({ enableLogging: false })
        const response = await animeClient.getAnimePictures(animeId)
        setPictures(response.data)
      } catch (err) {
        setError('Không thể tải danh sách hình ảnh')
        console.error('Error fetching pictures:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPictures()
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

  if (pictures.length === 0) {
    return (
      <EmptyState
        icon="🖼️"
        title="Chưa có hình ảnh"
        description="Chưa có hình ảnh nào được cập nhật cho anime này."
      />
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {pictures.map((picture: AnimePicture, index: number) => (
          <div 
            key={index} 
            className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setSelectedImage(picture.images?.jpg?.large_image_url || picture.images?.jpg?.image_url)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={picture.images?.jpg?.image_url}
              alt={`Anime picture ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt="Full size image"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
