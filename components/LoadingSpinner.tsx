'use client'

export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium text-lg">{message}</p>
    </div>
  )
}
