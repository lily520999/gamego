'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { User as GameUser } from '@/types/game'

// 用户类型定义
interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

// 认证上下文类型定义
interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider 的 props 类型
interface AuthProviderProps {
  children: ReactNode
}

// 认证提供者组件
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // 检查是否已经登录
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('/api/auth/me')
        setUser(response.data)
      } catch (err) {
        // 未登录状态，不设置错误
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // 登录函数
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.post('/api/auth/login', { email, password })
      setUser(response.data)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // 注册函数
  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.post('/api/auth/register', { name, email, password })
      setUser(response.data)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // 登出函数
  const logout = async () => {
    try {
      setLoading(true)
      await axios.post('/api/auth/logout')
      setUser(null)
      router.push('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to logout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 自定义钩子，方便使用认证上下文
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 