import { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface SeasonLayoutProps {
  children: ReactNode
  params: { year: string; season: string }
}

function validateSeasonParams(year: string, season: string) {
  const yearNum = parseInt(year)
  if (isNaN(yearNum) || yearNum < 1960 || yearNum > 2030) {
    return false
  }

  const validSeasons = ['winter', 'spring', 'summer', 'fall']
  if (!validSeasons.includes(season)) {
    return false
  }

  return true
}

function getSeasonInfo(season: string) {
  const seasonData = {
    'winter': {
      name: 'Mùa đông',
      icon: '❄️',
      months: 'Tháng 1-3',
      color: 'from-blue-500 to-cyan-500'
    },
    'spring': {
      name: 'Mùa xuân',
      icon: '🌸',
      months: 'Tháng 4-6',
      color: 'from-pink-500 to-rose-500'
    },
    'summer': {
      name: 'Mùa hè',
      icon: '☀️',
      months: 'Tháng 7-9',
      color: 'from-orange-500 to-yellow-500'
    },
    'fall': {
      name: 'Mùa thu',
      icon: '🍁',
      months: 'Tháng 10-12',
      color: 'from-amber-500 to-orange-500'
    }
  }

  return seasonData[season as keyof typeof seasonData]
}

export default function SeasonLayout({ children, params }: SeasonLayoutProps) {
  const { year, season } = params
  
  if (!validateSeasonParams(year, season)) {
    notFound()
  }

  const seasonInfo = getSeasonInfo(season)
  const yearNum = parseInt(year)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="mb-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              Trang chủ
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/seasons" className="text-blue-600 hover:text-blue-800 transition-colors">
              Mùa phim
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">{seasonInfo.name} {year}</span>
          </nav>


          {/* Navigation */}
          <div className="flex justify-center space-x-4">
            <Link
              href={`/seasons/${yearNum - 1}/${season}`}
              className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              ← {seasonInfo.name} {yearNum - 1}
            </Link>
            <Link
              href="/seasons"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tất cả mùa phim
            </Link>
            <Link
              href={`/seasons/${yearNum + 1}/${season}`}
              className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {seasonInfo.name} {yearNum + 1} →
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { year: string; season: string } }) {
  const { year, season } = params
  
  if (!validateSeasonParams(year, season)) {
    return {
      title: 'Mùa phim không tồn tại',
    }
  }

  const seasonInfo = getSeasonInfo(season)

  return {
    title: `${seasonInfo.name} ${year} - Anime Wiki`,
    description: `Khám phá anime ${seasonInfo.name.toLowerCase()} ${year}. ${seasonInfo.months}`,
    openGraph: {
      title: `${seasonInfo.name} ${year}`,
      description: `Khám phá anime ${seasonInfo.name.toLowerCase()} ${year}`,
    }
  }
}
