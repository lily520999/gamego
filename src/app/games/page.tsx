'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Game, Tag } from '@/types/game'
import { useRouter, useSearchParams } from 'next/navigation'
import SearchBar from '@/components/SearchBar'

export default function GamesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState({
    tag: '',
    sort: 'latest'
  })
  
  // 获取所有游戏和标签
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [gamesResponse, tagsResponse] = await Promise.all([
          axios.get('/api/games'),
          axios.get('/api/tags')
        ])
        
        setGames(gamesResponse.data)
        setFilteredGames(gamesResponse.data)
        setTags(tagsResponse.data)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load games. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // 根据筛选条件更新游戏列表
  useEffect(() => {
    let result = [...games]
    
    // 标签筛选
    if (filter.tag) {
      result = result.filter(game => 
        game.tags.some(tag => 
          typeof tag === 'object' ? tag.name === filter.tag : tag === filter.tag
        )
      )
    }
    
    // 排序
    if (filter.sort === 'latest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (filter.sort === 'popular') {
      result.sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    }
    
    setFilteredGames(result)
  }, [games, filter])
  
  // 清除筛选
  const clearFilters = () => {
    setFilter({ tag: '', sort: 'latest' })
  }
  
  // 处理搜索
  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Browse Games</h1>
        
        <div className="w-full md:w-1/3">
          <SearchBar 
            initialQuery={initialQuery} 
            placeholder="Search for games..." 
            onSubmit={handleSearch}
          />
        </div>
      </div>
      
      <div className="lg:flex gap-8">
        {/* 筛选侧边栏 */}
        <div className="lg:w-1/4 mb-6 lg:mb-0">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Filters</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Sort By</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      checked={filter.sort === 'latest'}
                      onChange={() => setFilter({ ...filter, sort: 'latest' })}
                      className="h-4 w-4 text-primary"
                    />
                    <span className="ml-2 text-gray-600">Latest</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      checked={filter.sort === 'popular'}
                      onChange={() => setFilter({ ...filter, sort: 'popular' })}
                      className="h-4 w-4 text-primary"
                    />
                    <span className="ml-2 text-gray-600">Most Popular</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {tags.map(tag => (
                    <label key={tag.id} className="flex items-center">
                      <input
                        type="radio"
                        name="tag"
                        checked={filter.tag === tag.name}
                        onChange={() => setFilter({ ...filter, tag: tag.name })}
                        className="h-4 w-4 text-primary"
                      />
                      <span className="ml-2 text-gray-600">
                        {tag.name}
                        {tag._count && (
                          <span className="text-xs text-gray-400 ml-1">
                            ({tag._count.games})
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <button
                onClick={clearFilters}
                className="w-full mt-6 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* 游戏列表 */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredGames.map((game) => (
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
                            {game.tags.slice(0, 3).map((tag) => (
                              <span 
                                key={typeof tag === 'object' ? tag.id : tag} 
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                              >
                                {typeof tag === 'object' ? tag.name : tag}
                              </span>
                            ))}
                            {game.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{game.tags.length - 3}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>by {typeof game.author === 'object' ? game.author.name : 'Unknown'}</span>
                            <span>{game.downloads || 0} downloads</span>
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
                  <p className="text-gray-500 mb-6">Try changing your filters or search terms</p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
} 