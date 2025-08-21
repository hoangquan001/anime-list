import { VideosTab } from '../../components/tabs/VideosTab'

interface VideosPageProps {
  params: { id: string }
}

export default function VideosPage({ params }: VideosPageProps) {
  return <VideosTab animeId={Number(params.id)} />
}
