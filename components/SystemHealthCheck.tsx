'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { DatabaseTester, DatabaseTestResult } from '@/lib/databaseTest'
import { DataIntegrityTester } from '@/lib/testHelpers'
import { propertiesApi, roomsApi, occupantsApi } from '@/lib/api'

interface HealthCheckResult {
  name: string
  status: 'success' | 'error' | 'warning' | 'loading'
  message: string
  details?: string[]
}

export default function SystemHealthCheck() {
  const [results, setResults] = useState<HealthCheckResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runHealthCheck = async () => {
    setIsRunning(true)
    const newResults: HealthCheckResult[] = []

    // Database connectivity test
    newResults.push({ name: 'Database Connection', status: 'loading', message: 'Testing...' })
    setResults([...newResults])

    try {
      const dbResult = await DatabaseTester.testConnection()
      newResults[0] = {
        name: 'Database Connection',
        status: dbResult.connectionStatus === 'connected' ? 'success' : 'error',
        message: dbResult.connectionStatus === 'connected' ? 'Connected' : 'Failed to connect',
        details: dbResult.errors
      }
    } catch {
      newResults[0] = {
        name: 'Database Connection',
        status: 'error',
        message: 'Connection test failed'
      }
    }

    // API endpoints test
    newResults.push({ name: 'API Endpoints', status: 'loading', message: 'Testing...' })
    setResults([...newResults])

    try {
      await propertiesApi.getAll()
      newResults[1] = {
        name: 'API Endpoints',
        status: 'success',
        message: 'All endpoints responding'
      }
    } catch (error) {
      newResults[1] = {
        name: 'API Endpoints',
        status: 'error',
        message: 'API endpoints failed',
        details: [String(error)]
      }
    }

    // Data integrity test
    newResults.push({ name: 'Data Integrity', status: 'loading', message: 'Testing...' })
    setResults([...newResults])

    try {
      const integrityResult = await DataIntegrityTester.testPropertyCRUD(propertiesApi)
      newResults[2] = {
        name: 'Data Integrity',
        status: integrityResult.success ? 'success' : 'error',
        message: integrityResult.success ? 'Data operations working' : 'Data integrity issues',
        details: integrityResult.errors
      }
    } catch (error) {
      newResults[2] = {
        name: 'Data Integrity',
        status: 'error',
        message: 'Integrity test failed',
        details: [String(error)]
      }
    }

    setResults(newResults)
    setIsRunning(false)
  }

  const getStatusIcon = (status: HealthCheckResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'loading':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
    }
  }

  const getStatusColor = (status: HealthCheckResult['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'loading':
        return 'border-blue-200 bg-blue-50'
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">System Health Check</h2>
        <button
          onClick={runHealthCheck}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Running...' : 'Run Check'}
        </button>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${getStatusColor(result.status)}`}
          >
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(result.status)}
              <h3 className="font-semibold text-gray-900">{result.name}</h3>
            </div>
            <p className="text-gray-700 mb-2">{result.message}</p>
            {result.details && result.details.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-600 mb-1">Details:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {result.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Click "Run Check" to test system health
        </div>
      )}
    </div>
  )
}