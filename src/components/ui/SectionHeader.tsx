import Link from 'next/link'

interface SectionHeaderProps {
  title: string
  viewAllHref?: string
  viewAllText?: string
  description?: string
  icon?: string
  className?: string
}

export function SectionHeader({ 
  title, 
  viewAllHref, 
  viewAllText = 'Xem tất cả →',
  description,
  icon,
  className = ''
}: SectionHeaderProps) {
  return (
    <div className={`flex justify-between items-start mb-8 ${className}`}>
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
          {icon && <span className="text-3xl">{icon}</span>}
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 mt-2">{description}</p>
        )}
      </div>
      {viewAllHref && (
        <Link 
          href={viewAllHref} 
          className="text-blue-600 hover:text-blue-800 font-semibold text-sm md:text-base whitespace-nowrap"
        >
          {viewAllText}
        </Link>
      )}
    </div>
  )
}
