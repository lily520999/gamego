import React from 'react'
import GameCard from './GameCard'
import { Game } from '@/types/game'

interface GameListProps {
  games: Game[]
  title?: string
}

export default function GameList({ games, title }: GameListProps) {
  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <GameCard
            key={game.id}
            id={game.id}
            title={game.title}
            description={game.description}
            thumbnailUrl={game.thumbnailUrl}
            author={game.author}
          />
        ))}
      </div>
    </div>
  )
} 