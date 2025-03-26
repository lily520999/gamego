import prisma from './prisma'

// 获取所有游戏
export async function getAllGames() {
  const games = await prisma.game.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      tags: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return games
}

// 搜索游戏
export async function searchGames(query: string) {
  const games = await prisma.game.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          tags: {
            some: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          author: {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
      ],
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      tags: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return games
}

// 获取特定游戏
export async function getGameById(id: string) {
  const game = await prisma.game.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      tags: true,
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!game) {
    throw new Error('Game not found')
  }

  return game
}

// 创建新游戏
export async function createGame(data: {
  title: string
  description: string
  thumbnailUrl: string
  fileUrl: string
  authorId: string
  tags: string[]
}) {
  // 处理标签
  const tagObjects = []
  for (const tag of data.tags) {
    const existingTag = await prisma.tag.findUnique({
      where: { name: tag },
    })

    if (existingTag) {
      tagObjects.push({ id: existingTag.id })
    } else {
      const newTag = await prisma.tag.create({
        data: { name: tag },
      })
      tagObjects.push({ id: newTag.id })
    }
  }

  // 创建游戏
  const game = await prisma.game.create({
    data: {
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      fileUrl: data.fileUrl,
      authorId: data.authorId,
      tags: {
        connect: tagObjects,
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      tags: true,
    },
  })

  return game
}

// 增加下载次数
export async function incrementDownload(id: string) {
  const game = await prisma.game.update({
    where: { id },
    data: {
      downloads: {
        increment: 1,
      },
    },
  })

  return game
}

// 获取特定标签的游戏
export async function getGamesByTag(tagName: string) {
  const games = await prisma.game.findMany({
    where: {
      tags: {
        some: {
          name: tagName,
        },
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      tags: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return games
}

// 获取所有标签
export async function getAllTags() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          games: true,
        },
      },
    },
  })

  return tags
}

// 添加评论
export async function addComment(userId: string, gameId: string, content: string) {
  const comment = await prisma.comment.create({
    data: {
      content,
      userId,
      gameId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  })

  return comment
} 