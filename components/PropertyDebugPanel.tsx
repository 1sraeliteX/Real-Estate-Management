'use client'

import React, { useState, useEffect } from 'react'
import { Bug, Download, Trash2, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react'
import { getDebugPanelData, PropertyDebugInfo } from '@/lib/utils/propertyDebugger'

interface PropertyDebugPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function PropertyDebugPanel({ isOpen, onClose }: PropertyDebugPanelProps) {
  const [logs, setLogs] = useState<PropertyDebugInfo[]>([])
  const [environment, setEnvironment] = useState<any>({})
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (isOpen) {
      refreshData()
      const interval = setInterval(refreshData, 2000) // Refresh every 2 seconds
      return () => clearInterval(interval)
    }
  }, [isOpen])

  const refreshData = () => {
    const data = getDebugPanelData()
    setLogs(data.logs)
    setEnvironment(data.environment)
  }

  const toggleLogExpansion = (index: number) => {
    const newExpanded = new Set(expandedLogs)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedLogs(newExpanded)
  }

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `property-debug-logs-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all debug logs?')) {
      // This would need to be implemented in the debugger
      setLogs([])
    }
  }

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true
    if (filter === 'errors') return !!log.error
    if (filter === 'api') return log.context === 'network'
    if (filter === 'form') return log.context === 'form'
    if (filter === 'database') return log.context === 'database'
    return true
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Property Creation Debug Panel</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={exportLogs}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Export Logs"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={clearLogs}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Clear Logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Environment Info */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Environment</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Node Env:</span>
                    <span className="font-mono">{environment.nodeEnv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">API URL:</span>
                    <span className="font-mono text-xs">{environment.apiUrl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Use Mock:</span>
                    <span className="font-mono">{environment.useMock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Auth:</span>
                    <span className="font-mono">{environment.authEnabled}</span>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Filter Logs</h3>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="all">All Logs ({logs.length})</option>
                  <option value="errors">Errors Only ({logs.filter(l => l.error).length})</option>
                  <option value="api">API Calls ({logs.filter(l => l.context === 'network').length})</option>
                  <option value="form">Form Events ({logs.filter(l => l.context === 'form').length})</option>
                  <option value="database">Database ({logs.filter(l => l.context === 'database').length})</option>
                </select>
              </div>

              {/* Stats */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Statistics</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Logs:</span>
                    <span>{logs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Errors:</span>
                    <span>{logs.filter(l => l.error).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">API Calls:</span>
                    <span>{logs.filter(l => l.context === 'network').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No logs found. Try creating a property to see debug information.
                </div>
              ) : (
                filteredLogs.map((log, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-3 ${
                      log.error ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleLogExpansion(index)}
                    >
                      <div className="flex items-center gap-2">
                        {expandedLogs.has(index) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <span className="font-medium">{log.action}</span>
                        {log.context && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {log.context}
                          </span>
                        )}
                        {log.error && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">
                            ERROR
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    {expandedLogs.has(index) && (
                      <div className="mt-3 space-y-2">
                        {log.data && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Data:</h4>
                            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          </div>
                        )}
                        {log.error && (
                          <div>
                            <h4 className="text-sm font-medium text-red-700 mb-1">Error:</h4>
                            <pre className="text-xs bg-red-100 p-2 rounded overflow-x-auto text-red-800">
                              {JSON.stringify(log.error, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Debug button component
export function PropertyDebugButton() {
  const [isOpen, setIsOpen] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-40"
        title="Open Debug Panel"
      >
        <Bug className="w-5 h-5" />
      </button>
      <PropertyDebugPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}