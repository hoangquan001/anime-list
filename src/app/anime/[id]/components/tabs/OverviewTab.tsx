import type { Anime } from '@jikan-ts/models'

interface OverviewTabProps {
  anime: Anime
}

export function OverviewTab({ anime }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Information */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4">Thông tin chi tiết</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Thể loại:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {anime.genres?.map((genre) => (
                  <span key={genre.mal_id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <strong>Studio:</strong>
              <div className="mt-1">
                {anime.studios?.map((studio, index) => (
                  <span key={studio.mal_id}>
                    {index > 0 && ', '}{studio.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <strong>Nguồn:</strong> {anime.source}
            </div>
            <div>
              <strong>Thời lượng:</strong> {anime.duration}
            </div>
            <div>
              <strong>Phát sóng:</strong> {anime.aired?.from} - {anime.aired?.to || 'Đang phát'}
            </div>
            <div>
              <strong>Mùa:</strong> {anime.season} {anime.year}
            </div>
          </div>
        </div>

        {/* Background */}
        {anime.background && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold mb-4">Background</h3>
            <p className="text-gray-700 leading-relaxed">{anime.background}</p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Related Anime */}
        {anime.relations && anime.relations.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold mb-4">Anime liên quan</h3>
            <div className="space-y-3">
              {anime.relations.slice(0, 5).map((relation, index) => (
                <div key={index} className="border-b border-gray-200 pb-2 last:border-b-0">
                  <div className="text-sm text-gray-600">{relation.relation}</div>
                  {relation.entry.map((entry) => (
                    <a 
                      key={entry.mal_id}
                      href={`/anime/${entry.mal_id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {entry.name}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* External Links */}
        {anime.external && anime.external.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold mb-4">Liên kết ngoài</h3>
            <div className="space-y-2">
              {anime.external.slice(0, 5).map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  {link.name} ↗
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
