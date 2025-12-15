'use client'

import LoadingSpinner from './LoadingSpinner'

interface PageLoaderProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function PageLoader({ text = 'Loading...', size = 'lg' }: PageLoaderProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="text-center">
        <LoadingSpinner size={size} text={text} />
      </div>
    </div>
  )
}