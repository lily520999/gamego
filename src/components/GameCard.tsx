import React from 'react'
import Link from 'next/link'

export interface GameCardProps {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  author: string
}

export default function GameCard({ id, title, description, thumbnailUrl, author }: GameCardProps) {
  return (
    <Link href={`/games/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
          <p className="text-gray-500 text-sm">By {author}</p>
        </div>
      </div>
    </Link>
  )
} 