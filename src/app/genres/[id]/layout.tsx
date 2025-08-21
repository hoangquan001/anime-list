import { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GenresClient } from '../../../../jikan-ts'
import { GenreNav } from './components/GenreNav'

interface GenreLayoutProps {
  children: ReactNode
  params: { id: string }
}

async function getGenreInfo(genreId: number) {
  const genresClient = new GenresClient({ enableLogging: false })
  const [animeGenresRes, mangaGenresRes] = await Promise.all([
    genresClient.getAnimeGenres(),
    genresClient.getMangaGenres()
  ])

  const allGenres = [...animeGenresRes.data, ...mangaGenresRes.data]
  return allGenres.find(g => g.mal_id === genreId)
}

export default async function GenreLayout({ children, params }: GenreLayoutProps) {
  const genreId = parseInt(params.id)
  
  if (isNaN(genreId)) {
    notFound()
  }

  try {
    const genre = await getGenreInfo(genreId)

    if (!genre) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with Genre Info */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <nav className="mb-6">
              <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                Trang chủ
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/genres" className="text-blue-600 hover:text-blue-800 transition-colors">
                Thể loại
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">{genre.name}</span>
            </nav>

            {/* Genre Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Thể loại: {genre.name}
              </h1>
              <p className="text-lg text-gray-600">
                Khám phá tất cả anime và manga thuộc thể loại {genre.name}
              </p>
            </div>

            {/* Navigation Tabs */}
            {/* <div className="flex justify-center">
              <GenreNav genreId={genreId} />
            </div> */}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching genre info:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Lỗi tải dữ liệu</h1>
          <p className="text-gray-600">Không thể tải thông tin thể loại. Vui lòng thử lại sau.</p>
        </div>
      </div>
    )
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const genreId = parseInt(params.id)
  
  if (isNaN(genreId)) {
    return {
      title: 'Thể loại không tồn tại',
    }
  }

  try {
    const genresClient = new GenresClient({ enableLogging: false })
    const [animeGenresRes, mangaGenresRes] = await Promise.all([
      genresClient.getAnimeGenres(),
      genresClient.getMangaGenres()
    ])

    const allGenres = [...animeGenresRes.data, ...mangaGenresRes.data]
    const genre = allGenres.find(g => g.mal_id === genreId)

    if (!genre) {
      return {
        title: 'Thể loại không tồn tại',
      }
    }

    return {
      title: `Thể loại ${genre.name} - Anime Wiki`,
      description: `Khám phá tất cả anime và manga thuộc thể loại ${genre.name}`,
      openGraph: {
        title: `Thể loại ${genre.name}`,
        description: `Khám phá tất cả anime và manga thuộc thể loại ${genre.name}`,
      }
    }
  } catch {
    return {
      title: 'Thể loại - Anime Wiki',
    }
  }
}
