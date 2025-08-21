import { StaffTab } from '../../components/tabs/StaffTab'

interface StaffPageProps {
  params: { id: string }
}

export default function StaffPage({ params }: StaffPageProps) {
  return <StaffTab animeId={Number(params.id)} />
}
