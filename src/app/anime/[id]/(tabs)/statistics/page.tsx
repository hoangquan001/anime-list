import { StatisticsTab } from '../../components/tabs/StatisticsTab'

interface StatisticsPageProps {
  params: { id: string }
}

export default function StatisticsPage({ params }: StatisticsPageProps) {
  return <StatisticsTab animeId={Number(params.id)} />
}
