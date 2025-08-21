import Link from 'next/link'
import type { AnimeStaff } from '@jikan-ts/models'

interface StaffCardProps {
  staff: AnimeStaff
  className?: string
}

export function StaffCard({ staff, className = '' }: StaffCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex">
        {/* Person Image */}
        <div className="w-20 h-24 flex-shrink-0">
          {staff.person.images?.jpg?.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={staff.person.images.jpg.image_url}
              alt={staff.person.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Person Info */}
        <div className="flex-1 p-4">
          <Link 
            href={`/people/${staff.person.mal_id}`}
            className="font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 block"
          >
            {staff.person.name}
          </Link>
          
          {/* Positions */}
          <div className="mt-2">
            {staff.positions.map((position, index) => (
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
  )
}
