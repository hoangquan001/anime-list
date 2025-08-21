import Link from 'next/link'

interface Tab {
  label: string
  href: string
  active: boolean
  count?: number
}

interface TabNavigationProps {
  tabs: Tab[]
  className?: string
}

export function TabNavigation({ tabs, className = '' }: TabNavigationProps) {
  return (
    <div className={`bg-white shadow-sm border-t ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors flex items-center space-x-2 ${
                tab.active
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  tab.active 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
