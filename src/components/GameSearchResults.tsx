'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Game } from '@/types/game'

type GameSearchResultsProps = {
  games: Game[]
  loading: boolean
  error: string | null
  query: string
}

export default function GameSearchResults({ games, loading, error, query }: GameSearchResultsProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md my-4">
        <p>Error: {error}</p>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-700 mb-2">No games found</h3>
        <p className="text-gray-500">
          We couldn't find any games matching "{query}". Try different keywords or browse all games.
        </p>
        <Link href="/games" className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">
          Browse All Games
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4">
      <p className="text-sm text-gray-500">
        Found {games.length} {games.length === 1 ? 'game' : 'games'} for "{query}"
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 w-full bg-gray-200">
                {game.thumbnailUrl ? (
                  <Image
                    src={game.thumbnailUrl}
                    alt={game.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{game.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{game.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                      {game.author.name.charAt(0)}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{game.author.name}</span>
                  </div>
                  
                  {game.tags && game.tags.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {game.tags[0].name}{game.tags.length > 1 ? ` +${game.tags.length - 1}` : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 