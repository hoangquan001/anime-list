import { RecommendationsTab } from '../../components/tabs/RecommendationsTab'

interface RecommendationsPageProps {
  params: { id: string }
}

export default function RecommendationsPage({ params }: RecommendationsPageProps) {
  return <RecommendationsTab animeId={Number(params.id)} />
}
