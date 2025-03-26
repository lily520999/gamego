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
        { error: 'Unauthorized. Please sign in to view your games.' },
        { status: 401 }
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
    
    // 获取用户上传的游戏
    const games = await prisma.game.findMany({
      where: {
        authorId: user.id
      },
      include: {
        tags: true,
        author: true,
        _count: {
          select: {
            comments: true,
            favorites: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(games)
  } catch (error: any) {
    console.error('Error fetching user games:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user games' },
      { status: 500 }
    )
  }
} 