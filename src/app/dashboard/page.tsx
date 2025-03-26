'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Game } from '@/types/game'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('my-games')
  const [games, setGames] = useState<Game[]>([])
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 如果用户未登录且认证已完成加载，重定向到登录页
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    // 加载用户的游戏
    const fetchUserGames = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        setError(null)
        
        const response = await axios.get('/api/user/games')
        setGames(response.data)
        
        const favResponse = await axios.get('/api/user/favorites')
        setFavoriteGames(favResponse.data)
      } catch (err) {
        console.error('Error fetching user games:', err)
        setError('Failed to load your games. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserGames()
  }, [user])

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Link
            href="/upload"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload New Game
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('my-games')}
              className={`py-4 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
                activeTab === 'my-games'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Games
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`py-4 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
                activeTab === 'favorites'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {activeTab === 'my-games' && (
                <div>
                  {games.length > 0 ? (
                    <div className="space-y-6">
                      {games.map((game) => (
                        <div key={game.id} className="flex flex-col sm:flex-row border rounded-lg overflow-hidden">
                          <div className="relative w-full sm:w-48 h-32 bg-gray-200">
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
                          
                          <div className="flex-1 p-4">
                            <div className="flex flex-wrap justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">{game.title}</h3>
                              <div className="text-sm text-gray-500">
                                {new Date(game.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {game.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-2">
                                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                  {game.downloads || 0} downloads
                                </span>
                                
                                {game.tags && game.tags.length > 0 && (
                                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                    {game.tags[0].name}
                                    {game.tags.length > 1 && ` +${game.tags.length - 1}`}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex space-x-2">
                                <Link
                                  href={`/games/${game.id}/edit`}
                                  className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                >
                                  Edit
                                </Link>
                                <Link
                                  href={`/games/${game.id}`}
                                  className="inline-flex items-center px-3 py-1 text-sm bg-primary text-white rounded hover:bg-opacity-90"
                                >
                                  View
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">You haven't uploaded any games yet</h3>
                      <p className="text-gray-500 mb-4">Share your awesome creations with the GameGo community</p>
                      <Link
                        href="/upload"
                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Upload Your First Game
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'favorites' && (
                <div>
                  {favoriteGames.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteGames.map((game) => (
                        <Link key={game.id} href={`/games/${game.id}`}>
                          <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-40 bg-gray-200">
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
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  // 处理取消收藏
                                }}
                                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                            
                            <div className="p-4">
                              <h3 className="font-medium text-gray-800 mb-1">{game.title}</h3>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{game.description}</p>
                              <div className="flex items-center text-sm text-gray-500">
                                <span>by {typeof game.author === 'object' ? game.author.name : game.author}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No favorite games yet</h3>
                      <p className="text-gray-500 mb-4">Browse games and add them to your favorites</p>
                      <Link
                        href="/games"
                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                      >
                        Browse Games
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'analytics' && (
                <div className="text-center py-10">
                  <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-primary bg-opacity-10 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We're working on building detailed analytics for your games.
                    Track downloads, engagement, and more in the future.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
} 