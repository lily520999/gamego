'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Tag } from '@/types/game'

export default function UploadGamePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  // 游戏信息状态
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [gameFile, setGameFile] = useState<File | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [newTag, setNewTag] = useState('')
  
  // UI状态
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [formErrors, setFormErrors] = useState<{
    title?: string
    description?: string
    thumbnail?: string
    gameFile?: string
  }>({})

  // 检查用户登录状态
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // 获取所有标签
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/api/tags')
        setAvailableTags(response.data)
      } catch (err) {
        console.error('Error fetching tags:', err)
      }
    }

    fetchTags()
  }, [])

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setThumbnail(file)
      
      // 创建预览
      const reader = new FileReader()
      reader.onload = (event) => {
        setThumbnailPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGameFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGameFile(e.target.files[0])
    }
  }

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const validateStep1 = () => {
    const errors: { title?: string; description?: string } = {}
    
    if (!title.trim()) {
      errors.title = 'Title is required'
    }
    
    if (!description.trim()) {
      errors.description = 'Description is required'
    } else if (description.length < 20) {
      errors.description = 'Description must be at least 20 characters'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep2 = () => {
    const errors: { thumbnail?: string; gameFile?: string } = {}
    
    if (!thumbnail) {
      errors.thumbnail = 'Game thumbnail is required'
    }
    
    if (!gameFile) {
      errors.gameFile = 'Game file is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep1() || !validateStep2()) {
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // 创建FormData对象
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      
      if (thumbnail) {
        formData.append('thumbnail', thumbnail)
      }
      
      if (gameFile) {
        formData.append('gameFile', gameFile)
      }
      
      tags.forEach(tag => {
        formData.append('tags', tag)
      })
      
      // 发送请求
      const response = await axios.post('/api/games/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // 上传成功，跳转到游戏页面
      router.push(`/games/${response.data.id}`)
    } catch (err: any) {
      console.error('Error uploading game:', err)
      setError(err.response?.data?.error || 'Failed to upload game. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Upload Your Game</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 pt-6">
          <div className="flex mb-8">
            <div className="w-1/3 px-2">
              <div className={`relative pb-6 flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary bg-opacity-10' : 'border-gray-300'}`}>
                  1
                </div>
                <div className="mt-2 text-sm font-medium">Game Details</div>
                {step > 1 && <div className="absolute h-1 bg-primary w-full top-5 left-full"></div>}
              </div>
            </div>
            <div className="w-1/3 px-2">
              <div className={`relative pb-6 flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary bg-opacity-10' : 'border-gray-300'}`}>
                  2
                </div>
                <div className="mt-2 text-sm font-medium">Upload Files</div>
                {step > 2 && <div className="absolute h-1 bg-primary w-full top-5 left-full"></div>}
              </div>
            </div>
            <div className="w-1/3 px-2">
              <div className={`relative pb-6 flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-primary bg-primary bg-opacity-10' : 'border-gray-300'}`}>
                  3
                </div>
                <div className="mt-2 text-sm font-medium">Tags & Review</div>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="px-6 pb-6">
            {/* Step 1: Game Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">
                    Game Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter a catchy title for your game"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-red-500 text-xs">{formErrors.title}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe your game. Include gameplay details, controls, and anything players should know."
                  ></textarea>
                  {formErrors.description && (
                    <p className="mt-1 text-red-500 text-xs">{formErrors.description}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Min 20 characters, be descriptive to help players find your game
                  </p>
                </div>
              </div>
            )}
            
            {/* Step 2: Upload Files */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Game Thumbnail
                  </label>
                  <div className="flex items-center space-x-4">
                    <div 
                      className={`w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 ${
                        formErrors.thumbnail ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {thumbnailPreview ? (
                        <img 
                          src={thumbnailPreview} 
                          alt="Thumbnail preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <label 
                        htmlFor="thumbnail" 
                        className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer"
                      >
                        Select Image
                      </label>
                      <input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG or GIF, max 2MB. Recommended size: 512x512px
                      </p>
                      {formErrors.thumbnail && (
                        <p className="mt-1 text-red-500 text-xs">{formErrors.thumbnail}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Game File
                  </label>
                  <div className={`p-6 border-2 border-dashed rounded-lg bg-gray-50 ${
                    formErrors.gameFile ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      
                      <div className="mt-4">
                        <label 
                          htmlFor="gameFile" 
                          className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 cursor-pointer"
                        >
                          Upload Game File
                        </label>
                        <input
                          id="gameFile"
                          type="file"
                          accept=".zip,.html,.js,.exe"
                          onChange={handleGameFileChange}
                          className="hidden"
                        />
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-500">
                        {gameFile ? `Selected: ${gameFile.name}` : 'Supports ZIP, HTML, or other executable formats'}
                      </p>
                      
                      {formErrors.gameFile && (
                        <p className="mt-1 text-red-500 text-xs">{formErrors.gameFile}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Tags & Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag) => (
                      <div key={tag} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1">
                        <span className="text-gray-800 text-sm">{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-opacity-90"
                    >
                      Add
                    </button>
                  </div>
                  
                  <p className="mt-1 text-xs text-gray-500">
                    Add relevant tags to help players discover your game. You can add up to 5 tags.
                  </p>
                  
                  {availableTags.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Popular tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.slice(0, 10).map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => !tags.includes(tag.name) && setTags([...tags, tag.name])}
                            disabled={tags.includes(tag.name)}
                            className={`px-3 py-1 text-xs rounded-full ${
                              tags.includes(tag.name)
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Review Your Submission</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 mb-4 md:mb-0 md:pr-4">
                        {thumbnailPreview ? (
                          <img 
                            src={thumbnailPreview} 
                            alt="Game thumbnail" 
                            className="rounded-lg w-full h-auto"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">No thumbnail</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="md:w-2/3">
                        <h4 className="font-semibold text-lg text-gray-800">{title}</h4>
                        <p className="text-sm text-gray-600 my-2">
                          {description.length > 150 ? description.substring(0, 150) + '...' : description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tags.map((tag) => (
                            <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                          {tags.length === 0 && (
                            <span className="text-xs text-gray-500">No tags added</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                          Game File: {gameFile ? gameFile.name : 'No file selected'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Uploading...' : 'Upload Game'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 