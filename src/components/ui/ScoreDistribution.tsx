interface ScoreDistributionProps {
  scores: Array<{
    score: number
    votes: number
  }>
  total: number
  className?: string
}

export function ScoreDistribution({ scores, total, className = '' }: ScoreDistributionProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {scores.map((score) => {
        const percentage = total ? (score.votes / total) * 100 : 0
        return (
          <div key={score.score} className="flex items-center">
            <div className="w-8 text-sm text-gray-600">{score.score}</div>
            <div className="flex-1 mx-3">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <div className="w-16 text-sm text-gray-600 text-right">
              {score.votes.toLocaleString()}
            </div>
            <div className="w-12 text-xs text-gray-500 text-right">
              {percentage.toFixed(1)}%
            </div>
          </div>
        )
      })}
    </div>
  )
}
