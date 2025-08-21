"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimeClient } from '@jikan-ts'
import type { AnimeStaff } from '@jikan-ts/models'
import { EmptyState } from '@/components'

interface StaffTabProps {
  animeId: number
}

export function StaffTab({ animeId }: StaffTabProps) {
  const [staff, setStaff] = useState<AnimeStaff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true)
        const animeClient = new AnimeClient({ enableLogging: false })
        const response = await animeClient.getAnimeStaff(animeId)
        setStaff(response.data)
      } catch (err) {
        setError('Không thể tải danh sách staff')
        console.error('Error fetching staff:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStaff()
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

  if (staff.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title="Chưa có thông tin staff"
        description="Thông tin đội ngũ sản xuất cho anime này chưa được cập nhật."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {staff.map((member: AnimeStaff) => (
        <div key={`${member.person.mal_id}-${member.positions.join('-')}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex">
            {/* Person Image */}
            <div className="w-20 h-24 flex-shrink-0">
              {member.person.images?.jpg?.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.person.images.jpg.image_url}
                  alt={member.person.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* Person Info */}
            <div className="flex-1 p-4">
              <Link 
                href={`/people/${member.person.mal_id}`}
                className="font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2"
              >
                {member.person.name}
              </Link>
              
              {/* Positions */}
              <div className="mt-2">
                {member.positions.map((position, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-1 mb-1"
                  >
                    {position}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
