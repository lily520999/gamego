import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(
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
    
    // 查找游戏并增加下载计数
    const game = await prisma.game.update({
      where: {
        id
      },
      data: {
        downloads: {
          increment: 1
        }
      }
    })
    
    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, downloads: game.downloads })
  } catch (error: any) {
    console.error('Error updating download count:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update download count' },
      { status: 500 }
    )
  }
} 