// Database connection and integrity testing utilities

export interface DatabaseTestResult {
  connectionStatus: 'connected' | 'failed'
  tablesExist: boolean
  dataIntegrity: boolean
  errors: string[]
  warnings: string[]
}

export class DatabaseTester {
  static async testConnection(): Promise<DatabaseTestResult> {
    const result: DatabaseTestResult = {
      connectionStatus: 'failed',
      tablesExist: false,
      dataIntegrity: false,
      errors: [],
      warnings: []
    }

    try {
      // Test basic connection
      const response = await fetch('/api/health/database')
      if (response.ok) {
        result.connectionStatus = 'connected'
      } else {
        result.errors.push('Database connection failed')
        return result
      }

      // Test table existence
      const tablesResponse = await fetch('/api/health/tables')
      if (tablesResponse.ok) {
        const tables = await tablesResponse.json()
        const requiredTables = ['properties', 'rooms', 'occupants', 'payments', 'maintenance_requests']
        const missingTables = requiredTables.filter(table => !tables.includes(table))
        
        if (missingTables.length === 0) {
          result.tablesExist = true
        } else {
          result.errors.push(`Missing tables: ${missingTables.join(', ')}`)
        }
      }

      // Test data integrity
      const integrityResponse = await fetch('/api/health/integrity')
      if (integrityResponse.ok) {
        const integrity = await integrityResponse.json()
        result.dataIntegrity = integrity.valid
        if (!integrity.valid) {
          result.errors.push(...integrity.errors)
        }
        if (integrity.warnings) {
          result.warnings.push(...integrity.warnings)
        }
      }

    } catch (error) {
      result.errors.push(`Database test failed: ${error}`)
    }

    return result
  }

  static async seedTestData(): Promise<boolean> {
    try {
      const response = await fetch('/api/seed/test-data', { method: 'POST' })
      return response.ok
    } catch {
      return false
    }
  }

  static async cleanupTestData(): Promise<boolean> {
    try {
      const response = await fetch('/api/cleanup/test-data', { method: 'DELETE' })
      return response.ok
    } catch {
      return false
    }
  }
}