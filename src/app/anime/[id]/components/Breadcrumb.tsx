interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-6">
      {items.map((item, index) => (
        <span key={index}>
          {item.href && !item.active ? (
            <a href={item.href} className="text-blue-200 hover:text-white transition-colors">
              {item.label}
            </a>
          ) : (
            <span className={item.active ? "text-white" : "text-blue-200"}>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="mx-2 text-blue-300">/</span>
          )}
        </span>
      ))}
    </nav>
  )
}
