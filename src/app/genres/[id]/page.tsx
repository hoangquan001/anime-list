import { redirect } from 'next/navigation'

interface GenrePageProps {
  params: { id: string }
}

export default function GenrePage({ params }: GenrePageProps) {
  // Redirect to anime page by default
  redirect(`/genres/${params.id}/anime`)
}
