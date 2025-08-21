export default function LoadingAnime() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-white/10 rounded mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-white/10 rounded" />
              ))}
            </div>
            <div className="h-64 bg-white/10 rounded" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-48 bg-white/10 rounded" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-[360px] bg-white/10 rounded" />
            <div className="h-56 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
