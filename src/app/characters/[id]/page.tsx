import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CharactersClient } from '../../../../jikan-ts'
import { Badge } from '@/components'
import CharacterAnimeTab from './components/CharacterAnimeTab'
import CharacterMangaTab from './components/CharacterMangaTab'
import CharacterVoicesTab from './components/CharacterVoicesTab'
import CharacterPicturesTab from './components/CharacterPicturesTab'

interface CharacterPageProps {
  params: { id: string }
  searchParams: { tab?: string }
}

export default async function CharacterPage({ params, searchParams }: CharacterPageProps) {
  const characterId = parseInt(params.id)
  const activeTab = searchParams.tab || 'about'
  
  if (isNaN(characterId)) {
    notFound()
  }

  try {
    const charactersClient = new CharactersClient({ enableLogging: false })
    const characterRes = await charactersClient.getCharacterFullById(characterId)
    const character = characterRes.data

    if (!character) {
      notFound()
    }

    const tabs = [
      { id: 'about', label: 'Thông tin', icon: '📋' },
      { id: 'anime', label: 'Anime', icon: '📺' },
      { id: 'manga', label: 'Manga', icon: '📚' },
      { id: 'voices', label: 'Lồng tiếng', icon: '🎤' },
      { id: 'pictures', label: 'Hình ảnh', icon: '🖼️' }
    ]

    const renderTabContent = () => {
      switch (activeTab) {
        case 'anime':
          return <CharacterAnimeTab characterId={characterId} />
        case 'manga':
          return <CharacterMangaTab characterId={characterId} />
        case 'voices':
          return <CharacterVoicesTab characterId={characterId} />
        case 'pictures':
          return <CharacterPicturesTab characterId={characterId} />
        default:
          return (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Thông tin nhân vật</h2>
              
              {character.about ? (
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {character.about}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Chưa có thông tin chi tiết về nhân vật này.</p>
              )}

              {character.nicknames && character.nicknames.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Biệt danh</h3>
                  <div className="flex flex-wrap gap-2">
                    {character.nicknames.map((nickname, index) => (
                      <Badge key={index} variant="secondary">
                        {nickname}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
      }
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <nav>
              <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                Trang chủ
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/characters" className="text-blue-600 hover:text-blue-800 transition-colors">
                Nhân vật
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">{character.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Character Header */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="md:flex">
              {/* Character Image */}
              <div className="md:w-1/3 lg:w-1/4">
                <div className="relative aspect-[3/4] md:aspect-auto md:h-96">
                  <img
                    src={character.images?.jpg?.image_url}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                  {character.favorites && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      ❤️ {character.favorites.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Character Info */}
              <div className="md:w-2/3 lg:w-3/4 p-6">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{character.name}</h1>
                  {character.name_kanji && (
                    <p className="text-xl text-gray-600 mb-2">{character.name_kanji}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin cơ bản</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">MAL ID:</span>
                        <span className="font-medium">{character.mal_id}</span>
                      </div>
                      {character.favorites && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Yêu thích:</span>
                          <span className="font-medium">{character.favorites.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">URL:</span>
                        <a
                          href={character.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          MyAnimeList ↗
                        </a>
                      </div>
                    </div>
                  </div>

                  {character.nicknames && character.nicknames.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Biệt danh</h3>
                      <div className="flex flex-wrap gap-2">
                        {character.nicknames.slice(0, 5).map((nickname, index) => (
                          <Badge key={index} variant="secondary">
                            {nickname}
                          </Badge>
                        ))}
                        {character.nicknames.length > 5 && (
                          <Badge variant="outline">
                            +{character.nicknames.length - 5} khác
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-t border-gray-200">
              <nav className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <Link
                    key={tab.id}
                    href={`?tab=${tab.id}`}
                    className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <Suspense
            fallback={
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            }
          >
            {renderTabContent()}
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching character:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Lỗi tải dữ liệu</h1>
          <p className="text-gray-600">Không thể tải thông tin nhân vật. Vui lòng thử lại sau.</p>
        </div>
      </div>
    )
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const characterId = parseInt(params.id)
  
  if (isNaN(characterId)) {
    return {
      title: 'Nhân vật không tồn tại',
    }
  }

  try {
    const charactersClient = new CharactersClient({ enableLogging: false })
    const characterRes = await charactersClient.getCharacterById(characterId)
    const character = characterRes.data

    if (!character) {
      return {
        title: 'Nhân vật không tồn tại',
      }
    }

    return {
      title: `${character.name} - Anime Wiki`,
      description: character.about ? character.about.slice(0, 160) + '...' : `Thông tin chi tiết về nhân vật ${character.name}`,
      openGraph: {
        title: character.name,
        description: character.about ? character.about.slice(0, 160) + '...' : `Thông tin chi tiết về nhân vật ${character.name}`,
        images: character.images?.jpg?.image_url ? [character.images.jpg.image_url] : [],
      }
    }
  } catch {
    return {
      title: 'Nhân vật - Anime Wiki',
    }
  }
}
