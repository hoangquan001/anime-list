interface StatsCardProps {
  value: string | number
  label: string
  icon?: string
  color?: 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'gray'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const colorClasses = {
  blue: 'text-blue-600',
  purple: 'text-purple-600', 
  green: 'text-green-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
  gray: 'text-gray-600'
}

const sizeClasses = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl'
}

export function StatsCard({ 
  value, 
  label, 
  icon, 
  color = 'blue', 
  size = 'lg',
  className = ''
}: StatsCardProps) {
  return (
    <div className={`p-4 md:p-6 text-center ${className}`}>
      <div className="flex items-center justify-center space-x-2 mb-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <div className={`${sizeClasses[size]} font-bold ${colorClasses[color]}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
      </div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  )
}
