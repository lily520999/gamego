import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始填充数据库...')

  // 清理现有数据
  await prisma.comment.deleteMany()
  await prisma.game.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 清理完成')

  // 创建标签
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Action' } }),
    prisma.tag.create({ data: { name: 'Adventure' } }),
    prisma.tag.create({ data: { name: 'RPG' } }),
    prisma.tag.create({ data: { name: 'Strategy' } }),
    prisma.tag.create({ data: { name: 'Simulation' } }),
    prisma.tag.create({ data: { name: 'Puzzle' } }),
    prisma.tag.create({ data: { name: 'Sports' } }),
    prisma.tag.create({ data: { name: 'Racing' } }),
  ])

  console.log('🏷️ 标签创建完成')

  // 创建用户
  const passwordHash = await hash('password123', 10)

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: passwordHash,
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: passwordHash,
        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random',
      },
    }),
  ])

  console.log('👤 用户创建完成')

  // 创建游戏
  const games = await Promise.all([
    prisma.game.create({
      data: {
        title: 'Space Adventure',
        description: 'An exciting space exploration game with stunning graphics and immersive gameplay.',
        thumbnailUrl: '/images/placeholder.jpg',
        fileUrl: '/games/space-adventure.zip',
        authorId: users[0].id,
        downloads: 1250,
        rating: 4.7,
        tags: {
          connect: [
            { id: tags[0].id }, // Action
            { id: tags[1].id }, // Adventure
          ],
        },
      },
    }),
    prisma.game.create({
      data: {
        title: 'Medieval Kingdom',
        description: 'Build your own medieval kingdom and defend it against invaders.',
        thumbnailUrl: '/images/placeholder.jpg',
        fileUrl: '/games/medieval-kingdom.zip',
        authorId: users[1].id,
        downloads: 980,
        rating: 4.5,
        tags: {
          connect: [
            { id: tags[3].id }, // Strategy
            { id: tags[4].id }, // Simulation
          ],
        },
      },
    }),
    prisma.game.create({
      data: {
        title: 'Puzzle Master',
        description: 'A challenging puzzle game that will test your problem-solving skills.',
        thumbnailUrl: '/images/placeholder.jpg',
        fileUrl: '/games/puzzle-master.zip',
        authorId: users[0].id,
        downloads: 750,
        rating: 4.2,
        tags: {
          connect: [
            { id: tags[5].id }, // Puzzle
          ],
        },
      },
    }),
  ])

  console.log('🎮 游戏创建完成')

  // 创建评论
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'This game is amazing! The graphics are stunning.',
        userId: users[1].id,
        gameId: games[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'I love the gameplay mechanics. Very intuitive.',
        userId: users[0].id,
        gameId: games[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'The puzzles are challenging but not impossible. Great balance!',
        userId: users[1].id,
        gameId: games[2].id,
      },
    }),
  ])

  console.log('💬 评论创建完成')
  console.log('✅ 数据库填充完成!')
}

main()
  .catch((e) => {
    console.error('❌ 填充数据库失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 