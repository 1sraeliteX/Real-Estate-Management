/**
 * Property Creation Debugging Utilities
 */

export interface PropertyDebugInfo {
  timestamp: string
  action: string
  data: any
  error?: any
  context?: string
}

class PropertyDebugger {
  private logs: PropertyDebugInfo[] = []
  private isEnabled: boolean

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'development' || 
                     process.env.NEXT_PUBLIC_DEBUG_PROPERTIES === 'true'
  }

  log(action: string, data: any, context?: string, error?: any) {
    if (!this.isEnabled) return

    const logEntry: PropertyDebugInfo = {
      timestamp: new Date().toISOString(),
      action,
      data: this.sanitizeData(data),
      context,
      error: error ? this.sanitizeError(error) : undefined
    }

    this.logs.push(logEntry)
    
    // Keep only last 50 logs to prevent memory issues
    if (this.logs.length > 50) {
      this.logs = this.logs.slice(-50)
    }

    // Console output for immediate debugging
    const prefix = error ? '❌' : '📋'
    console.log(`${prefix} [PropertyDebug] ${action}:`, {
      data: logEntry.data,
      context,
      error: logEntry.error
    })
  }

  private sanitizeData(data: any): any {
    try {
      // Remove sensitive information and circular references
      return JSON.parse(JSON.stringify(data, (key, value) => {
        // Remove sensitive fields
        if (['password', 'token', 'secret'].includes(key.toLowerCase())) {
          return '[REDACTED]'
        }
        return value
      }))
    } catch {
      return String(data)
    }
  }

  private sanitizeError(error: any): any {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : undefined
    }
  }

  getLogs(): PropertyDebugInfo[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  // Validation helpers
  validatePropertyData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data.name?.trim()) {
      errors.push('Property name is required')
    }

    if (!data.address?.trim()) {
      errors.push('Property address is required')
    }

    if (!data.type) {
      errors.push('Property type is required')
    }

    if (!data.yearlyRent || data.yearlyRent <= 0) {
      errors.push('Valid yearly rent is required')
    }

    if (data.amenities && !Array.isArray(data.amenities)) {
      errors.push('Amenities must be an array')
    }

    if (data.images && !Array.isArray(data.images)) {
      errors.push('Images must be an array')
    }

    // Type-specific validations
    if (data.type === 'lodge') {
      if (!data.numberOfRooms || data.numberOfRooms <= 0) {
        errors.push('Number of rooms is required for lodge properties')
      }
      if (!data.numberOfBathrooms || data.numberOfBathrooms <= 0) {
        errors.push('Number of bathrooms is required for lodge properties')
      }
    } else {
      if (!data.bedrooms || data.bedrooms <= 0) {
        errors.push('Number of bedrooms is required for non-lodge properties')
      }
      if (!data.bathrooms || data.bathrooms <= 0) {
        errors.push('Number of bathrooms is required for non-lodge properties')
      }
    }

    this.log('validatePropertyData', { data, errors }, 'validation')

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Network debugging
  logApiCall(method: string, url: string, data?: any, response?: any, error?: any) {
    this.log('apiCall', {
      method,
      url,
      requestData: data,
      response: response ? {
        status: response.status,
        data: response.data
      } : undefined
    }, 'network', error)
  }

  // Form debugging
  logFormSubmission(formData: any, validationResult?: any) {
    this.log('formSubmission', {
      formData,
      validation: validationResult
    }, 'form')
  }

  // Database debugging
  logDatabaseOperation(operation: string, data: any, result?: any, error?: any) {
    this.log('databaseOperation', {
      operation,
      data,
      result
    }, 'database', error)
  }
}

// Singleton instance
export const propertyDebugger = new PropertyDebugger()

// React hook for debugging
export const usePropertyDebugger = () => {
  return {
    log: propertyDebugger.log.bind(propertyDebugger),
    getLogs: propertyDebugger.getLogs.bind(propertyDebugger),
    clearLogs: propertyDebugger.clearLogs.bind(propertyDebugger),
    exportLogs: propertyDebugger.exportLogs.bind(propertyDebugger),
    validatePropertyData: propertyDebugger.validatePropertyData.bind(propertyDebugger),
    logApiCall: propertyDebugger.logApiCall.bind(propertyDebugger),
    logFormSubmission: propertyDebugger.logFormSubmission.bind(propertyDebugger)
  }
}

// Debug panel component data
export const getDebugPanelData = () => {
  return {
    logs: propertyDebugger.getLogs(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      useMock: process.env.NEXT_PUBLIC_USE_MOCK,
      authEnabled: process.env.NEXT_PUBLIC_AUTH_ENABLED
    }
  }
}