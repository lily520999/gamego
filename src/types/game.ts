export interface User {
  id: string
  name: string
  avatar?: string
}

export interface Tag {
  id: string
  name: string
  _count?: {
    games: number
  }
}

export interface Comment {
  id: string
  content: string
  createdAt: string
  user: User
}

export interface Game {
  id: string
  title: string
  description: string
  thumbnailUrl?: string
  fileUrl?: string
  downloads?: number
  authorId?: string
  author: User
  tags: Tag[]
  comments?: Comment[]
  createdAt: string
  updatedAt?: string
} 