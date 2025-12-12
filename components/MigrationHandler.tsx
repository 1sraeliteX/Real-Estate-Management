'use client'

import { useEffect, useState } from 'react'
import { LocalStorageMigration } from '@/lib/utils/migrateLocalStorage'

export default function MigrationHandler() {
  const [migrating, setMigrating] = useState(false)

  useEffect(() => {
    const handleMigration = async () => {
      if (LocalStorageMigration.needsMigration()) {
        setMigrating(true)
        try {
          await LocalStorageMigration.migrateAllData()
        } catch (error) {
          console.error('Migration failed:', error)
        } finally {
          setMigrating(false)
        }
      }
    }

    // Run migration after a short delay to ensure app is initialized
    const timer = setTimeout(handleMigration, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!migrating) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Migrating Data</h3>
            <p className="text-sm text-gray-600">
              Moving your data to the database for better performance...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}