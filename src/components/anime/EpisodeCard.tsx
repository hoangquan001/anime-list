import type { AnimeEpisode } from '@jikan-ts/models'

interface EpisodeCardProps {
  episode: AnimeEpisode
  className?: string
}

export function EpisodeCard({ episode, className = '' }: EpisodeCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Tập {episode.mal_id}
            </span>
            {episode.filler && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                Filler
              </span>
            )}
            {episode.recap && (
              <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">
                Recap
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {episode.title}
          </h3>
          
          {episode.title_japanese && episode.title_japanese !== episode.title && (
            <p className="text-gray-600 text-sm mb-2">
              {episode.title_japanese}
            </p>
          )}
          
          {episode.title_romanji && episode.title_romanji !== episode.title && (
            <p className="text-gray-500 text-sm mb-2">
              {episode.title_romanji}
            </p>
          )}
        </div>
        
        <div className="flex flex-col md:items-end mt-4 md:mt-0 space-y-2">
          {episode.aired && (
            <div className="text-sm text-gray-600">
              📅 {new Date(episode.aired).toLocaleDateString('vi-VN')}
            </div>
          )}
          
          {episode.duration && (
            <div className="text-sm text-gray-600">
              ⏱️ {episode.duration} phút
            </div>
          )}
          
          {episode.forum_url && (
            <a
              href={episode.forum_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              💬 Thảo luận
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
