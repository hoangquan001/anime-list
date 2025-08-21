import { redirect } from 'next/navigation'

interface YearPageProps {
  params: { year: string }
}

export default function YearPage({ params }: YearPageProps) {
  const year = parseInt(params.year)
  
  // Validate year
  if (isNaN(year) || year < 1960 || year > 2030) {
    redirect('/seasons')
  }

  // Determine current season or default to spring
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  let defaultSeason = 'spring'
  
  // If it's the current year, determine the actual season
  if (year === currentYear) {
    if (currentMonth >= 1 && currentMonth <= 3) defaultSeason = 'winter'
    else if (currentMonth >= 4 && currentMonth <= 6) defaultSeason = 'spring'
    else if (currentMonth >= 7 && currentMonth <= 9) defaultSeason = 'summer'
    else defaultSeason = 'fall'
  }

  // Redirect to the determined season
  redirect(`/seasons/${year}/${defaultSeason}`)
}
