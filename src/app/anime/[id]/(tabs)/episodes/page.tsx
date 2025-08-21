import { EpisodesTab } from '../../components/tabs/EpisodesTab'

interface EpisodesPageProps {
  params: { id: string }
}

export default function EpisodesPage({ params }: EpisodesPageProps) {
  return <EpisodesTab animeId={Number(params.id)} />
}
