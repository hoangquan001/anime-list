import Link from 'next/link'
import type { AnimeCharacter } from '@jikan-ts/models'

interface CharacterCardProps {
  character: AnimeCharacter
  showVoiceActors?: boolean
  className?: string
}

export function CharacterCard({ 
  character, 
  showVoiceActors = true,
  className = ''
}: CharacterCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex">
        {/* Character Image */}
        <div className="w-20 h-24 flex-shrink-0">
          {character.character.images?.jpg?.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={character.character.images.jpg.image_url}
              alt={character.character.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Character Info */}
        <div className="flex-1 p-4">
          <Link 
            href={`/characters/${character.character.mal_id}`}
            className="font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 block"
          >
            {character.character.name}
          </Link>
          <p className="text-sm text-gray-600 mt-1">{character.role}</p>
          
          {/* Voice Actors */}
          {showVoiceActors && character.voice_actors && character.voice_actors.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Lồng tiếng:</p>
              {character.voice_actors.slice(0, 2).map((va, index) => (
                <div key={index} className="text-xs text-gray-600">
                  {va.person.name} ({va.language})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
