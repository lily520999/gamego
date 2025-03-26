import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // 验证用户是否已登录
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to add favorites.' },
        { status: 401 }
      )
    }
    
    // 获取游戏ID
    const { gameId } = await request.json()
    
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
    
    // 检查收藏是否已存在
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId
        }
      }
    })
    
    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Game is already in favorites' },
        { status: 400 }
      )
    }
    
    // 创建收藏
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        gameId
      }
    })
    
    return NextResponse.json({ success: true, favorite })
  } catch (error: any) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add favorite' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 验证用户是否已登录
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to remove favorites.' },
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
    
    // 删除收藏
    await prisma.favorite.delete({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId
        }
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // 验证用户是否已登录
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to view favorites.' },
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
    
    // 获取用户收藏的游戏
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: user.id
      },
      include: {
        game: {
          include: {
            author: true,
            tags: true
          }
        }
      }
    })
    
    // 提取游戏数据
    const games = favorites.map((favorite: { game: any }) => favorite.game)
    
    return NextResponse.json(games)
  } catch (error: any) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
} 