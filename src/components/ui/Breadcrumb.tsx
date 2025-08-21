import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && <span className="text-gray-400">/</span>}
          {item.href ? (
            <Link 
              href={item.href} 
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
