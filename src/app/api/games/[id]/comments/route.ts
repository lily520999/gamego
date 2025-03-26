import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户是否已登录
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to comment.' },
        { status: 401 }
      )
    }
    
    const gameId = params.id
    
    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      )
    }
    
    // 获取评论内容
    const { content } = await request.json()
    
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }
    
    // 检查游戏是否存在
    const game = await prisma.game.findUnique({
      where: {
        id: gameId
      }
    })
    
    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
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
    
    // 创建评论
    const comment = await prisma.comment.create({
      data: {
        content,
        gameId,
        userId: user.id
      },
      include: {
        user: true
      }
    })
    
    return NextResponse.json(comment)
  } catch (error: any) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create comment' },
      { status: 500 }
    )
  }
} 