'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

// 使用静态示例数据
export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  // 处理搜索
  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="min-h-screen">
      {/* 主页横幅 */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover, Play, and Share Amazing Games
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              GameGo is your platform to find indie games, share your creations,
              and connect with a community of passionate gamers and developers.
            </p>
            
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for games..."
                  className="w-full py-3 px-4 pr-12 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch((e.target as HTMLInputElement).value)}
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  onClick={() => {
                    const input = document.querySelector('input') as HTMLInputElement
                    if (input && input.value) handleSearch(input.value)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/games" className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-opacity-90 transition-colors">
                Browse Games
              </Link>
              {!user ? (
                <Link href="/register" className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors">
                  Join GameGo
                </Link>
              ) : (
                <Link href="/upload" className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors">
                  Upload Game
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* 特色游戏 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Featured Games
            </h2>
            <Link href="/games" className="text-primary hover:underline font-medium">
              View all games
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 mb-1">Example Game {i}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">This is an example game description. The actual games will be loaded when the database is properly set up.</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Action</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Adventure</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>by Example Developer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 开发者区域 */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="lg:flex items-center gap-12">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                For Game Developers
              </h2>
              <p className="text-gray-600 mb-6">
                GameGo provides a platform for indie game developers to showcase their talent and connect with players worldwide. Upload your games, receive feedback, and build your audience.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Easy game uploading and management</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Player feedback and comments</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Analytics and download statistics</span>
                </li>
              </ul>
              <Link href="/upload" className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 inline-block">
                Upload Your Game
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gray-100 rounded-lg p-6 relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-32 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-32 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/5"></div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-32 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-4/5"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/5"></div>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-4 rounded-lg border-2 border-dashed border-primary flex items-center justify-center">
                    <svg className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-primary text-white text-sm font-bold py-1 px-3 rounded-full">
                  Developer Dashboard
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 游戏玩家区域 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="lg:flex flex-row-reverse items-center gap-12">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                For Gamers
              </h2>
              <p className="text-gray-600 mb-6">
                Discover new and exciting games from indie developers around the world. Play, leave feedback, and keep track of your favorite titles all in one place.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Discover games by category and tags</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Create a collection of favorite games</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Engage with developers through comments</span>
                </li>
              </ul>
              <Link href="/games" className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 inline-block">
                Browse Games
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="bg-white p-5">
                    <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3 w-full"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-primary rounded-lg w-28"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-red-500 text-white text-sm font-bold py-1 px-3 rounded-full">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 促进行动区域 */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Join the GameGo Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Sign up today to upload your games, discover new titles, and connect with a community of game enthusiasts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Create Account
            </Link>
            <Link href="/games" className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors">
              Browse Games
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 