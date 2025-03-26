import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare, hash } from 'bcrypt'
import prisma from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        if ('avatar' in user) {
          token.avatar = user.avatar
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        if (token.avatar) {
          session.user.avatar = token.avatar as string
        }
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}

export async function createUser(name: string, email: string, password: string) {
  // 检查邮箱是否已被注册
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('Email already exists')
  }

  // 密码加密
  const hashedPassword = await hash(password, 10)

  // 创建用户
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    },
  })

  // 不返回密码
  const { passwordHash: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function verifyUser(email: string, password: string) {
  // 查找用户
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // 验证密码
  const passwordMatch = await compare(password, user.passwordHash)
  if (!passwordMatch) {
    throw new Error('Invalid password')
  }

  // 不返回密码
  const { passwordHash: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // 不返回密码
  const { passwordHash: _, ...userWithoutPassword } = user
  return userWithoutPassword
} 