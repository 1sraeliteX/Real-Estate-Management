// Performance monitoring utilities for production optimization

export class PerformanceMonitor {
  private static measurements: Map<string, number> = new Map()

  static startMeasurement(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      this.measurements.set(name, performance.now())
    }
  }

  static endMeasurement(name: string): number | null {
    if (typeof window !== 'undefined' && window.performance) {
      const startTime = this.measurements.get(name)
      if (startTime) {
        const duration = performance.now() - startTime
        this.measurements.delete(name)
        
        // Log only in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`)
        }
        
        return duration
      }
    }
    return null
  }

  static measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.startMeasurement(name)
    return fn().finally(() => {
      this.endMeasurement(name)
    })
  }

  static measureSync<T>(name: string, fn: () => T): T {
    this.startMeasurement(name)
    try {
      return fn()
    } finally {
      this.endMeasurement(name)
    }
  }
}

// Bundle size analyzer
export function analyzeBundleSize(): void {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const scripts = Array.from(document.querySelectorAll('script[src]'))
    const totalSize = scripts.reduce((acc, script) => {
      const src = (script as HTMLScriptElement).src
      if (src.includes('/_next/static/')) {
        // Estimate size based on typical Next.js chunks
        return acc + 100 // KB estimate
      }
      return acc
    }, 0)
    
    console.log(`📦 Estimated bundle size: ${totalSize}KB`)
  }
}

// Memory usage monitoring
export function monitorMemoryUsage(): void {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory
    if (process.env.NODE_ENV === 'development') {
      console.log(`🧠 Memory usage: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`)
    }
  }
}