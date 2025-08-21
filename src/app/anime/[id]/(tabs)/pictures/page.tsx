import { PicturesTab } from '../../components/tabs/PicturesTab'

interface PicturesPageProps {
  params: { id: string }
}

export default function PicturesPage({ params }: PicturesPageProps) {
  return <PicturesTab animeId={Number(params.id)} />
}
