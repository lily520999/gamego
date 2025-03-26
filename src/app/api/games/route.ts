import { NextResponse } from 'next/server'
import { getAllGames, createGame } from '@/lib/games'

// This is a mock data store - in a real app, this would be a database
const games = [
  {
    id: '1',
    title: 'Sample Game 1',
    description: 'An amazing game description',
    thumbnailUrl: '/images/placeholder.jpg',
    author: 'Game Developer 1',
  },
  {
    id: '2',
    title: 'Sample Game 2',
    description: 'Another great game description',
    thumbnailUrl: '/images/placeholder.jpg',
    author: 'Game Developer 2',
  },
]

export async function GET() {
  try {
    const games = await getAllGames()
    return NextResponse.json(games)
  } catch (error: any) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch games' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, thumbnailUrl, fileUrl, authorId, tags } = body

    // 验证输入
    if (!title || !description || !thumbnailUrl || !fileUrl || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 创建游戏
    const game = await createGame({
      title,
      description,
      thumbnailUrl,
      fileUrl,
      authorId,
      tags: Array.isArray(tags) ? tags : [],
    })

    return NextResponse.json(game, { status: 201 })
  } catch (error: any) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create game' },
      { status: 500 }
    )
  }
} 