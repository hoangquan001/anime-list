interface ProgressBarProps {
  value: number
  max: number
  label?: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
  className?: string
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500', 
  red: 'bg-red-500',
  purple: 'bg-purple-500'
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2', 
  lg: 'h-3'
}

export function ProgressBar({ 
  value, 
  max, 
  label,
  color = 'blue',
  size = 'md',
  showPercentage = false,
  className = ''
}: ProgressBarProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0
  
  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-gray-600">{label}</span>}
          {showPercentage && <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className={`bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}
