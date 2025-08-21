import Link from 'next/link'
import { GenresClient } from '../../../jikan-ts'
import type { Genre } from '../../../jikan-ts/models'
import { GridLayout } from '@/components'

interface GenreCardProps {
  genre: Genre
  type: 'anime' | 'manga'
}

function GenreCard({ genre, type }: GenreCardProps) {
  return (
    <Link
      href={`/genres/${genre.mal_id}/${type}`}
      className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300"
    >
      <div className="text-center">
     
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {genre.name}
        </h3>
      </div>
    </Link>
  )
}

function getGenreIcon(genreName: string): string {
  const iconMap: Record<string, string> = {
    'Action': '⚔️',
    'Adventure': '🗺️',
    'Comedy': '😂',
    'Drama': '🎭',
    'Fantasy': '🧙',
    'Horror': '👻',
    'Mystery': '🔍',
    'Romance': '💕',
    'Sci-Fi': '🚀',
    'Slice of Life': '🌸',
    'Sports': '⚽',
    'Supernatural': '👽',
    'Thriller': '😨',
    'Magic': '✨',
    'School': '🏫',
    'Music': '🎵',
    'Mecha': '🤖',
    'Historical': '🏛️',
    'Military': '🪖',
    'Police': '👮',
    'Psychological': '🧠',
    'Seinen': '👨',
    'Shoujo': '👩',
    'Shounen': '👦',
    'Josei': '👩‍💼'
  }
  
  return iconMap[genreName] || '📱'
}

export default async function GenresPage() {
  try {
    const genresClient = new GenresClient({ enableLogging: false })
    const [animeGenresRes, mangaGenresRes] = await Promise.all([
      genresClient.getAnimeGenres(),
      genresClient.getMangaGenres()
    ])

    const animeGenres = animeGenresRes.data
    const mangaGenres = mangaGenresRes.data
    console.log('animeGenres:', animeGenres.length, 'mangaGenres:', mangaGenres.length);
    
    // Combine và deduplicate genres
    const allGenresMap = new Map<number, Genre>()
    
    animeGenres.forEach(genre => allGenresMap.set(genre.mal_id, genre))
    mangaGenres.forEach(genre => allGenresMap.set(genre.mal_id, genre))
    
    const uniqueGenres = Array.from(allGenresMap.values()).sort((a, b) => a.name.localeCompare(b.name))

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
              <span className="text-gray-700">Thể loại</span>
            </nav>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Thể loại Anime & Manga</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Khám phá các thể loại anime và manga khác nhau. Tìm kiếm những series phù hợp với sở thích của bạn.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container mx-auto px-4 py-8">
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{uniqueGenres.length}</div>
              <div className="text-gray-600">Tổng thể loại</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{animeGenres.length}</div>
              <div className="text-gray-600">Thể loại Anime</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{mangaGenres.length}</div>
              <div className="text-gray-600">Thể loại Manga</div>
            </div>
          </div> */}
          
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md mb-8">
            
            
            {/* Anime Genres */}
            <div id="anime" className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Thể loại Anime</h2>
              <GridLayout cols={{ sm: 2, md: 3, lg: 4, xl: 5 }}>
                {animeGenres.map((genre) => (
                  <GenreCard key={`anime-${genre.mal_id}`} genre={genre} type="anime" />
                ))}
              </GridLayout>
            </div>

        
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching genres:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Lỗi tải dữ liệu</h1>
          <p className="text-gray-600">Không thể tải danh sách thể loại. Vui lòng thử lại sau.</p>
        </div>
      </div>
    )
  }
}

export async function generateMetadata() {
  return {
    title: 'Thể loại Anime & Manga - Anime Wiki',
    description: 'Khám phá các thể loại anime và manga khác nhau. Tìm kiếm những series phù hợp với sở thích của bạn.',
    openGraph: {
      title: 'Thể loại Anime & Manga',
      description: 'Khám phá các thể loại anime và manga khác nhau',
    }
  }
}
