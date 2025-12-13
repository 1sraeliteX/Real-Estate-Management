// Simple in-memory cache for API responses
class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttlSeconds: number = 60): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clear expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

export const cache = new SimpleCache()

// Cleanup expired entries every 5 minutes
if (typeof window === 'undefined') { // Server-side only
  setInterval(() => {
    cache.cleanup()
  }, 5 * 60 * 1000)
}

// Cache key generators
export const cacheKeys = {
  properties: (userId?: string, type?: string, search?: string) => 
    `properties:${userId || 'all'}:${type || 'all'}:${search || 'all'}`,
  property: (id: string, includeRelations: boolean = false) => 
    `property:${id}:${includeRelations}`,
  propertyStats: (userId?: string) => 
    `stats:${userId || 'all'}`,
}