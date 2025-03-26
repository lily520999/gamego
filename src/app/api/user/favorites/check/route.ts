import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // 验证用户是否已登录
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to check favorites.' },
        { status: 401 }
      )
    }
    
    // 获取URL查询参数中的游戏ID
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('gameId')
    
    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      )
    }
    
    // 获取当前用户ID
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // 检查收藏是否存在
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId
        }
      }
    })
    
    return NextResponse.json({ isFavorite: !!favorite })
  } catch (error: any) {
    console.error('Error checking favorite status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check favorite status' },
      { status: 500 }
    )
  }
} 