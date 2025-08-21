import { Suspense } from 'react'
import Link from 'next/link'
import { SeasonsClient } from '../../../jikan-ts'
import { GridLayout } from '@/components'
import type { SeasonsListData } from '../../../jikan-ts/models'

interface SeasonCardProps {
  seasonData: SeasonsListData
}

function SeasonCard({ seasonData }: SeasonCardProps) {
  const seasonIcons = {
    'winter': '❄️',
    'spring': '🌸',
    'summer': '☀️',
    'fall': '🍁'
  }

  const seasonColors = {
    'winter': 'from-blue-500 to-cyan-500',
    'spring': 'from-pink-500 to-rose-500',
    'summer': 'from-orange-500 to-yellow-500',
    'fall': 'from-amber-500 to-orange-500'
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{seasonData.year}</h3>
      <div className="grid grid-cols-2 gap-3">
        {seasonData.seasons.map((season) => (
          <Link
            key={`${seasonData.year}-${season}`}
            href={`/seasons/${seasonData.year}/${season}`}
            className="group block"
          >
            <div className={`bg-gradient-to-br ${seasonColors[season as keyof typeof seasonColors]} rounded-xl p-4 text-white transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1`}>
              <div className="text-center">
                <div className="text-3xl mb-2">
                  {seasonIcons[season as keyof typeof seasonIcons]}
                </div>
                <div className="font-semibold capitalize">
                  {season === 'fall' ? 'Mùa thu' : 
                   season === 'winter' ? 'Mùa đông' :
                   season === 'spring' ? 'Mùa xuân' : 'Mùa hè'}
                </div>
                <div className="text-sm opacity-90">{seasonData.year}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function CurrentSeasonCard() {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  let currentSeason = 'spring'
  if (currentMonth >= 1 && currentMonth <= 3) currentSeason = 'winter'
  else if (currentMonth >= 4 && currentMonth <= 6) currentSeason = 'spring'
  else if (currentMonth >= 7 && currentMonth <= 9) currentSeason = 'summer'
  else currentSeason = 'fall'

  const seasonNames = {
    'winter': 'Mùa đông',
    'spring': 'Mùa xuân', 
    'summer': 'Mùa hè',
    'fall': 'Mùa thu'
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Mùa phim hiện tại</h2>
        <div className="flex justify-center space-x-4">
          <Link
            href={`/seasons/${currentYear}/${currentSeason}`}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            🎬 {seasonNames[currentSeason as keyof typeof seasonNames]} {currentYear}
          </Link>
          <Link
            href="/seasons/now"
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            📺 Đang phát sóng
          </Link>
          <Link
            href="/seasons/upcoming"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            🔮 Sắp chiếu
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function SeasonsPage() {
  try {
    const seasonsClient = new SeasonsClient({ enableLogging: false })
    const seasonsListRes = await seasonsClient.getSeasonsList()
    const seasonsList = seasonsListRes.data

    // Group seasons by year and sort by year descending
    const seasonsData = seasonsList
      .sort((a, b) => b.year - a.year)
      .slice(0, 20) // Show last 20 years

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-8">
            <nav className="mb-6">
              <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                Trang chủ
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">Mùa phim</span>
            </nav>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Mùa phim Anime</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Khám phá anime theo từng mùa phim. Tìm hiểu những series hot nhất mỗi mùa trong năm.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Current Season Section */}
          <CurrentSeasonCard />



          {/* Seasons Grid */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tất cả mùa phim</h2>
            <GridLayout cols={{ sm: 1, md: 2, lg: 3, xl: 4 }}>
              {seasonsData.map((seasonData) => (
                <SeasonCard key={seasonData.year} seasonData={seasonData} />
              ))}
            </GridLayout>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching seasons list:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Lỗi tải dữ liệu</h1>
          <p className="text-gray-600">Không thể tải danh sách mùa phim. Vui lòng thử lại sau.</p>
        </div>
      </div>
    )
  }
}

export async function generateMetadata() {
  return {
    title: 'Mùa phim Anime - Anime Wiki',
    description: 'Khám phá anime theo từng mùa phim. Tìm hiểu những series hot nhất mỗi mùa trong năm.',
    openGraph: {
      title: 'Mùa phim Anime',
      description: 'Khám phá anime theo từng mùa phim trong từng năm',
    }
  }
}
