'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: any
  retryCount: number
}

export class PropertyCreationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Property Creation Error:', error)
    console.error('Error Info:', errorInfo)
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo)
    }
    
    this.setState({
      error,
      errorInfo
    })
  }

  logErrorToService = (error: Error, errorInfo: any) => {
    // In production, send to error tracking service
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    // Example: Send to Sentry, LogRocket, etc.
    console.error('Production Error:', errorData)
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }))
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900">
                  Property Creation Error
                </h3>
                <p className="text-sm text-red-700">
                  Something went wrong while creating the property
                </p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-red-100 rounded border text-sm">
              <p className="font-medium text-red-900 mb-1">Error Details:</p>
              <p className="text-red-800 font-mono text-xs break-all">
                {this.state.error?.message || 'Unknown error occurred'}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again {this.state.retryCount > 0 && `(${this.state.retryCount})`}
              </button>

              <div className="text-xs text-red-600 space-y-1">
                <p className="font-medium">Troubleshooting steps:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Check your internet connection</li>
                  <li>Verify all required fields are filled</li>
                  <li>Ensure images are valid URLs or files</li>
                  <li>Try refreshing the page</li>
                </ul>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-xs text-red-600 flex items-center gap-1">
                    <Bug className="w-3 h-3" />
                    Developer Details
                  </summary>
                  <div className="mt-2 p-2 bg-red-100 rounded text-xs font-mono">
                    <pre className="whitespace-pre-wrap text-red-800">
                      {this.state.error?.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <pre className="whitespace-pre-wrap text-red-700 mt-2">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for handling property creation errors
export const usePropertyCreationError = () => {
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleError = React.useCallback((error: any) => {
    console.error('Property creation error:', error)
    
    let errorMessage = 'Failed to create property. Please try again.'
    
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error
    } else if (error.message) {
      errorMessage = error.message
    }
    
    // Specific error handling
    if (error.response?.status === 400) {
      errorMessage = 'Invalid property data. Please check all fields and try again.'
    } else if (error.response?.status === 401) {
      errorMessage = 'Authentication required. Please log in and try again.'
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error. Please try again later or contact support.'
    } else if (error.code === 'NETWORK_ERROR') {
      errorMessage = 'Network error. Please check your connection and try again.'
    }
    
    setError(errorMessage)
    setIsLoading(false)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  const setLoading = React.useCallback((loading: boolean) => {
    setIsLoading(loading)
    if (loading) {
      setError(null)
    }
  }, [])

  return {
    error,
    isLoading,
    handleError,
    clearError,
    setLoading
  }
}