interface VideoCardProps {
  title: string
  thumbnailUrl?: string
  videoUrl?: string
  type?: 'trailer' | 'music' | 'episode'
  metadata?: {
    author?: string
    title?: string
  }
  className?: string
}

const typeConfig = {
  trailer: {
    color: 'bg-red-600 hover:bg-red-700',
    icon: '🎬'
  },
  music: {
    color: 'bg-purple-600 hover:bg-purple-700', 
    icon: '🎵'
  },
  episode: {
    color: 'bg-blue-600 hover:bg-blue-700',
    icon: '📺'
  }
}

export function VideoCard({ 
  title, 
  thumbnailUrl, 
  videoUrl = '#',
  type = 'trailer',
  metadata,
  className = ''
}: VideoCardProps) {
  const config = typeConfig[type]
  
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="aspect-video relative bg-gray-200">
        {thumbnailUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${config.color} text-white rounded-full p-4 transition-colors`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </a>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${config.color} text-white rounded-full p-4 transition-colors`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </a>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1">{title}</h3>
          <span className="text-xl ml-2">{config.icon}</span>
        </div>
        
        {metadata && (
          <div className="space-y-1">
            {metadata.author && (
              <p className="text-sm text-gray-600">🎤 {metadata.author}</p>
            )}
            {metadata.title && (
              <p className="text-sm text-gray-600">🎵 {metadata.title}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
