import { NextResponse } from 'next/server'
import { searchGames } from '@/lib/games'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const games = await searchGames(query)
    return NextResponse.json(games)
  } catch (error: any) {
    console.error('Error searching games:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to search games' },
      { status: 500 }
    )
  }
} 