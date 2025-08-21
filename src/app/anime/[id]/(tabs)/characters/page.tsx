import { CharactersTab } from '../../components/tabs/CharactersTab'
import { AnimeClient } from '@jikan-ts'

interface CharactersPageProps {
  params: { id: string }
}

export default function CharactersPage({ params }: CharactersPageProps) {
  return <CharactersTab animeId={Number(params.id)} />
}

export async function generateMetadata({ params }: CharactersPageProps) {
  try {
    const animeClient = new AnimeClient({ enableLogging: false })
    const response = await animeClient.getAnimeFullById(Number(params.id))
    const anime = response.data

    return {
      title: `Nhân vật - ${anime.title} - Anime Wiki`,
      description: `Danh sách các nhân vật trong anime ${anime.title}`,
    }
  } catch {
    return {
      title: 'Nhân vật không tìm thấy - Anime Wiki'
    }
  }
}
