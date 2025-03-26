import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AuthClientProvider from '@/components/AuthClientProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GameGo - Your Game Hosting Platform',
  description: 'Upload, share, and discover amazing games',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthClientProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow pt-16 bg-gray-50">
              {children}
            </main>
            <Footer />
          </div>
        </AuthClientProvider>
      </body>
    </html>
  )
} 