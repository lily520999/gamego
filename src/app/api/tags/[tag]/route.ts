import { NextResponse } from 'next/server'
import { getGamesByTag } from '@/lib/games'

export async function GET(
  request: Request,
  { params }: { params: { tag: string } }
) {
  try {
    const { tag } = params
    const games = await getGamesByTag(tag)
    return NextResponse.json(games)
  } catch (error: any) {
    console.error(`Error fetching games for tag ${params.tag}:`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch games' },
      { status: 500 }
    )
  }
} 