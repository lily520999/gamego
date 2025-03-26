import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// 最大文件大小 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    // 验证用户是否已登录
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to upload games.' },
        { status: 401 }
      )
    }
    
    // 解析multipart表单数据
    const formData = await request.formData()
    
    // 获取表单字段
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const thumbnail = formData.get('thumbnail') as File
    const gameFile = formData.get('gameFile') as File
    const tagValues = formData.getAll('tags') as string[]
    
    // 验证必填字段
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }
    
    if (!thumbnail || !gameFile) {
      return NextResponse.json(
        { error: 'Thumbnail and game file are required' },
        { status: 400 }
      )
    }
    
    // 检查文件大小
    if (thumbnail.size > MAX_FILE_SIZE || gameFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds the limit (10MB)' },
        { status: 400 }
      )
    }
    
    // 创建上传目录
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    const gameId = uuidv4()
    const gamePath = join(uploadDir, gameId)
    
    try {
      await mkdir(gamePath, { recursive: true })
    } catch (err) {
      console.error('Error creating upload directory:', err)
      return NextResponse.json(
        { error: 'Failed to create upload directory' },
        { status: 500 }
      )
    }
    
    // 保存文件
    const thumbnailBuffer = Buffer.from(await thumbnail.arrayBuffer())
    const gameFileBuffer = Buffer.from(await gameFile.arrayBuffer())
    
    const thumbnailExt = thumbnail.name.split('.').pop() || 'jpg'
    const gameFileExt = gameFile.name.split('.').pop() || 'zip'
    
    const thumbnailPath = `/uploads/${gameId}/thumbnail.${thumbnailExt}`
    const gameFilePath = `/uploads/${gameId}/game.${gameFileExt}`
    
    try {
      await writeFile(join(process.cwd(), 'public', thumbnailPath), thumbnailBuffer)
      await writeFile(join(process.cwd(), 'public', gameFilePath), gameFileBuffer)
    } catch (err) {
      console.error('Error saving files:', err)
      return NextResponse.json(
        { error: 'Failed to save files' },
        { status: 500 }
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
    
    // 创建游戏记录
    const game = await prisma.game.create({
      data: {
        title,
        description,
        thumbnailUrl: thumbnailPath,
        fileUrl: gameFilePath,
        authorId: user.id,
        tags: {
          connectOrCreate: tagValues.map(tag => ({
            where: { name: tag },
            create: { name: tag }
          }))
        }
      },
      include: {
        author: true,
        tags: true
      }
    })
    
    return NextResponse.json(game)
  } catch (error: any) {
    console.error('Error uploading game:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload game' },
      { status: 500 }
    )
  }
} 