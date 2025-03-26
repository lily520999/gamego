import { NextRequest, NextResponse } from 'next/server'
import { getGameById, incrementDownload } from '@/lib/games'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      )
    }
    
    const game = await prisma.game.findUnique({
      where: {
        id
      },
      include: {
        author: true,
        tags: true,
        comments: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })
    
    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(game)
  } catch (error: any) {
    console.error('Error fetching game details:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch game details' },
      { status: 500 }
    )
  }
}

// 增加下载次数的 API
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const game = await incrementDownload(id)
    return NextResponse.json(game)
  } catch (error: any) {
    console.error(`Error updating game ${params.id}:`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to update game' },
      { status: error.message === 'Game not found' ? 404 : 500 }
    )
  }
} 