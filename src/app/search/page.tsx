'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import SearchBar from '@/components/SearchBar'
import GameSearchResults from '@/components/GameSearchResults'
import { Game } from '@/types/game'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') || ''
  
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGames = async () => {
      if (!query) return
      
      setLoading(true)
      setError(null)
      
      try {
        const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`)
        setGames(response.data)
      } catch (err) {
        console.error('Error fetching search results:', err)
        setError('Failed to load search results. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [query])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Games</h1>
      
      <div className="max-w-2xl mb-8">
        <SearchBar initialQuery={query} placeholder="Search for games..." />
      </div>
      
      <GameSearchResults
        games={games}
        loading={loading}
        error={error}
        query={query}
      />
    </div>
  )
} 