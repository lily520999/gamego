'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { Game } from '@/types/game'

export default function TagPage() {
  const { tag } = useParams()
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const decodedTag = tag ? decodeURIComponent(tag as string) : ''
  
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await axios.get(`/api/tags/${decodedTag}`)
        setGames(response.data)
      } catch (err) {
        console.error('Error fetching games by tag:', err)
        setError('Failed to load games. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (decodedTag) {
      fetchGames()
    }
  }, [decodedTag])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/games" className="text-primary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Games
        </Link>
      </div>
      
      <div className="flex items-center mb-8">
        <div className="bg-primary bg-opacity-10 rounded-lg p-2 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Games tagged with "{decodedTag}"</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
        </div>
      ) : (
        <div>
          {games.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <Link key={game.id} href={`/games/${game.id}`}>
                  <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48 bg-gray-200">
                      {game.thumbnailUrl ? (
                        <img
                          src={game.thumbnailUrl}
                          alt={game.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 mb-1">{game.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{game.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {game.tags.map((tag) => (
                          <span key={typeof tag === 'object' ? tag.id : tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            {typeof tag === 'object' ? tag.name : tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>by {typeof game.author === 'object' ? game.author.name : 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No games found</h3>
              <p className="text-gray-500 mb-6">No games with the tag "{decodedTag}" were found</p>
              <Link href="/games" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">
                Browse All Games
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 