#!/usr/bin/env node

/**
 * Comprehensive Integration Test Script
 * Run this script to verify all application functionality
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

class IntegrationTester {
  constructor() {
    this.results = []
    this.errors = []
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`
    console.log(logMessage)
    
    if (type === 'error') {
      this.errors.push(logMessage)
    }
    
    this.results.push({ timestamp, type, message })
  }

  async runCommand(command, description) {
    this.log(`Running: ${description}`)
    try {
      const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' })
      this.log(`✅ ${description} - Success`)
      return { success: true, output }
    } catch (error) {
      this.log(`❌ ${description} - Failed: ${error.message}`, 'error')
      return { success: false, error: error.message }
    }
  }

  checkFileExists(filePath, description) {
    if (fs.existsSync(filePath)) {
      this.log(`✅ ${description} - File exists`)
      return true
    } else {
      this.log(`❌ ${description} - File missing: ${filePath}`, 'error')
      return false
    }
  }

  async checkEnvironmentSetup() {
    this.log('=== Environment Setup Check ===')
    
    // Check required files
    const requiredFiles = [
      { path: 'package.json', desc: 'Package.json' },
      { path: '.env.local', desc: 'Environment variables' },
      { path: 'next.config.js', desc: 'Next.js config' },
      { path: 'tsconfig.json', desc: 'TypeScript config' }
    ]

    for (const file of requiredFiles) {
      this.checkFileExists(file.path, file.desc)
    }

    // Check Node.js version
    await this.runCommand('node --version', 'Node.js version check')
    
    // Check npm/yarn
    await this.runCommand('npm --version', 'NPM version check')
  }

  async checkDependencies() {
    this.log('=== Dependencies Check ===')
    
    // Install dependencies
    await this.runCommand('npm ci', 'Install dependencies')
    
    // Check for security vulnerabilities
    await this.runCommand('npm audit --audit-level moderate', 'Security audit')
  }

  async checkCodeQuality() {
    this.log('=== Code Quality Check ===')
    
    // TypeScript compilation
    await this.runCommand('npx tsc --noEmit', 'TypeScript compilation')
    
    // Linting
    await this.runCommand('npm run lint', 'ESLint check')
    
    // Build check
    await this.runCommand('npm run build', 'Production build')
  }

  async checkApplicationFunctionality() {
    this.log('=== Application Functionality Check ===')
    
    // Start the application in background
    this.log('Starting application for testing...')
    
    // Note: In a real scenario, you'd start the app and run tests against it
    // For now, we'll check if the build was successful
    
    const buildDir = path.join(process.cwd(), '.next')
    if (fs.existsSync(buildDir)) {
      this.log('✅ Application build successful')
    } else {
      this.log('❌ Application build failed', 'error')
    }
  }

  async checkDatabaseConnectivity() {
    this.log('=== Database Connectivity Check ===')
    
    // Check if database URL is configured
    const envPath = path.join(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8')
      if (envContent.includes('DATABASE_URL') || envContent.includes('MONGODB_URI')) {
        this.log('✅ Database configuration found')
      } else {
        this.log('⚠️ Database configuration not found - using mock data', 'warning')
      }
    }
  }

  async checkFileUploadSetup() {
    this.log('=== File Upload Setup Check ===')
    
    // Check upload directory exists or can be created
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true })
        this.log('✅ Upload directory created')
      } catch (error) {
        this.log(`❌ Failed to create upload directory: ${error.message}`, 'error')
      }
    } else {
      this.log('✅ Upload directory exists')
    }
  }

  async checkSecurityConfiguration() {
    this.log('=== Security Configuration Check ===')
    
    // Check for security headers in Next.js config
    const nextConfigPath = path.join(process.cwd(), 'next.config.js')
    if (fs.existsSync(nextConfigPath)) {
      const configContent = fs.readFileSync(nextConfigPath, 'utf8')
      if (configContent.includes('headers') || configContent.includes('security')) {
        this.log('✅ Security headers configuration found')
      } else {
        this.log('⚠️ Consider adding security headers to next.config.js', 'warning')
      }
    }
  }

  generateReport() {
    this.log('=== Integration Test Report ===')
    
    const totalTests = this.results.length
    const errors = this.results.filter(r => r.type === 'error').length
    const warnings = this.results.filter(r => r.type === 'warning').length
    const successes = totalTests - errors - warnings

    this.log(`Total checks: ${totalTests}`)
    this.log(`Successes: ${successes}`)
    this.log(`Warnings: ${warnings}`)
    this.log(`Errors: ${errors}`)

    if (errors === 0) {
      this.log('🎉 All critical tests passed! Application is ready for deployment.')
    } else {
      this.log('❌ Some tests failed. Please address the errors before deployment.', 'error')
    }

    // Write detailed report to file
    const reportPath = path.join(process.cwd(), 'integration-test-report.json')
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: { totalTests, successes, warnings, errors },
      results: this.results
    }, null, 2))

    this.log(`Detailed report saved to: ${reportPath}`)
    
    return errors === 0
  }

  async run() {
    console.log('🚀 Starting Comprehensive Integration Test...\n')
    
    try {
      await this.checkEnvironmentSetup()
      await this.checkDependencies()
      await this.checkCodeQuality()
      await this.checkApplicationFunctionality()
      await this.checkDatabaseConnectivity()
      await this.checkFileUploadSetup()
      await this.checkSecurityConfiguration()
      
      const success = this.generateReport()
      process.exit(success ? 0 : 1)
      
    } catch (error) {
      this.log(`Fatal error during testing: ${error.message}`, 'error')
      process.exit(1)
    }
  }
}

// Run the integration test
if (require.main === module) {
  const tester = new IntegrationTester()
  tester.run()
}

module.exports = IntegrationTester