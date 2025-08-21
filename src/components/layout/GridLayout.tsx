import { ReactNode } from 'react'

interface GridLayoutProps {
  children: ReactNode
  cols?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  className?: string
}

export function GridLayout({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 4,
  className = ''
}: GridLayoutProps) {

  const gapClass = `gap-${gap}`
  
  const responsiveClasses = [
    cols.sm && `grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`
  ].filter(Boolean).join(' ')
  
  return (
    <div className={`grid ${responsiveClasses} ${gapClass} ${className}`}>
      {children}
    </div>
  )
}
