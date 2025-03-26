'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Tag } from '@/types/game'

export default function CategoriesPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [popularTags, setPopularTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get('/api/tags')
        const allTags = response.data
        
        // 按游戏数量排序标签
        allTags.sort((a: any, b: any) => (b._count?.games || 0) - (a._count?.games || 0))
        
        setTags(allTags)
        setPopularTags(allTags.slice(0, 6)) // 获取前6个最受欢迎的标签
      } catch (err) {
        console.error('Error fetching tags:', err)
        setError('Failed to load categories. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Game Categories</h1>
      
      {popularTags.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Popular Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {popularTags.map(tag => (
              <Link 
                key={tag.id} 
                href={`/tags/${tag.name}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-medium text-gray-800">{tag.name}</h3>
                  <p className="text-gray-500">{tag._count?.games || 0} games</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">All Categories</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tags.map(tag => (
              <Link 
                key={tag.id} 
                href={`/tags/${tag.name}`}
                className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full text-center transition-colors"
              >
                <span className="text-gray-800">{tag.name}</span>
                <span className="text-xs text-gray-500 ml-1">({tag._count?.games || 0})</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 