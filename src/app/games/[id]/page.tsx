'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Game, Comment } from '@/types/game'

// 模拟数据，后续会从API获取
const mockGames: Record<string, Game> = {
  '1': {
    id: '1',
    title: 'Sample Game 1',
    description: 'An amazing game with stunning graphics and immersive gameplay. Experience the adventure in this action-packed world full of mysteries and challenges. This game offers hours of entertainment with its complex storyline and engaging mechanics.',
    thumbnailUrl: '/images/placeholder.jpg',
    author: { id: '1', name: 'Game Developer 1' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    downloads: 1000,
    tags: [{ id: '1', name: 'Action' }, { id: '2', name: 'Adventure' }],
  },
  '2': {
    id: '2',
    title: 'Sample Game 2',
    description: 'Another great game with strategic elements and role-playing features. Build your kingdom, train your army, and conquer new territories in this epic strategy game. Develop your character and make meaningful choices that affect the game world.',
    thumbnailUrl: '/images/placeholder.jpg',
    author: { id: '2', name: 'Game Developer 2' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    downloads: 800,
    tags: [{ id: '3', name: 'Strategy' }, { id: '4', name: 'RPG' }],
  },
}

export default function GameDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [commentSubmitting, setCommentSubmitting] = useState(false)

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await axios.get(`/api/games/${id}`)
        setGame(response.data)
        
        // 检查游戏是否已收藏
        if (user) {
          const favResponse = await axios.get(`/api/user/favorites/check?gameId=${id}`)
          setIsFavorite(favResponse.data.isFavorite)
        }
      } catch (err) {
        console.error('Error fetching game details:', err)
        setError('Failed to load game details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchGame()
    }
  }, [id, user])

  const handleDownload = async () => {
    try {
      // 记录下载统计
      await axios.post(`/api/games/${id}/download`)
      
      // 跳转到文件URL
      if (game?.fileUrl) {
        window.open(game.fileUrl, '_blank')
      }
    } catch (err) {
      console.error('Error downloading game:', err)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      if (isFavorite) {
        await axios.delete(`/api/user/favorites?gameId=${id}`)
      } else {
        await axios.post(`/api/user/favorites`, { gameId: id })
      }
      
      setIsFavorite(!isFavorite)
    } catch (err) {
      console.error('Error toggling favorite:', err)
    }
  }

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push('/login')
      return
    }
    
    if (!commentText.trim()) {
      return
    }
    
    try {
      setCommentSubmitting(true)
      
      const response = await axios.post(`/api/games/${id}/comments`, {
        content: commentText
      })
      
      // 更新游戏评论
      setGame(prevGame => {
        if (!prevGame) return null
        
        return {
          ...prevGame,
          comments: [...(prevGame.comments || []), response.data]
        }
      })
      
      setCommentText('')
    } catch (err) {
      console.error('Error submitting comment:', err)
    } finally {
      setCommentSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error || 'Game not found'}</p>
        </div>
        <div className="mt-6 text-center">
          <Link href="/games" className="text-primary hover:underline">
            Browse other games
          </Link>
        </div>
      </div>
    )
  }

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
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <div className="relative h-64 md:h-full w-full bg-gray-200">
              {game.thumbnailUrl ? (
                <Image
                  src={game.thumbnailUrl}
                  alt={game.title}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{game.title}</h1>
              
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                {game.author && typeof game.author === 'object' && game.author.avatar ? (
                  <Image
                    src={game.author.avatar}
                    alt={game.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-gray-700 text-sm">
                    {game.author && typeof game.author === 'object' ? game.author.name.charAt(0) : 'U'}
                  </span>
                )}
              </div>
              <span className="text-gray-600">by {game.author && typeof game.author === 'object' ? game.author.name : 'Unknown'}</span>
            </div>
            
            <p className="text-gray-600 mb-6">{game.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {game.tags && game.tags.map(tag => (
                <Link
                  key={typeof tag === 'object' ? tag.id : tag}
                  href={`/tags/${typeof tag === 'object' ? tag.name : tag}`}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                >
                  {typeof tag === 'object' ? tag.name : tag}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-gray-600">
                <div>
                  <span className="font-medium">{game.downloads || 0}</span> downloads
                </div>
                <div className="text-sm">
                  Added on {new Date(game.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90"
              >
                Download Game
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments</h2>
          
          {user ? (
            <form onSubmit={submitComment} className="mb-6">
              <div className="mb-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Share your thoughts about this game..."
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={commentSubmitting || !commentText.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                >
                  {commentSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <p className="text-gray-600 mb-2">Sign in to leave a comment</p>
              <Link href="/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </div>
          )}
          
          <div className="space-y-4">
            {game.comments && game.comments.length > 0 ? (
              game.comments.map((comment: Comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      {comment.user.avatar ? (
                        <Image
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-gray-700 text-sm">{comment.user.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium text-gray-800">{comment.user.name}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 