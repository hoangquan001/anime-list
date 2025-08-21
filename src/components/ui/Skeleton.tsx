interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-300 rounded ${className}`} />
  )
}

export function AnimeCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="p-3">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-3 w-3/4 mb-2" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

export function AnimeListSkeleton() {
  return (
    <div className="flex bg-white rounded-lg shadow-sm p-4">
      <Skeleton className="w-20 h-28 rounded-lg flex-shrink-0" />
      <div className="flex-1 ml-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex gap-2 mb-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <div className="flex gap-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  )
}
