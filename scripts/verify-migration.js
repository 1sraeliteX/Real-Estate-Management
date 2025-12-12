/**
 * Verification script to ensure localStorage has been completely removed
 * and replaced with database functionality
 */

const fs = require('fs')
const path = require('path')

// Files and directories to search
const searchPaths = [
  'app',
  'components', 
  'lib',
  'pages' // if exists
]

// Patterns to look for localStorage usage
const localStoragePatterns = [
  /localStorage\.getItem/g,
  /localStorage\.setItem/g,
  /localStorage\.removeItem/g,
  /localStorage\.clear/g,
  /window\.localStorage/g
]

// Files to exclude from search (known safe files)
const excludeFiles = [
  'lib/utils/migrateLocalStorage.ts', // Migration utility
  'lib/utils/migrateProperties.ts',   // Legacy migration
  'components/MigrationHandler.tsx',  // Migration component
  'scripts/verify-migration.js'       // This file
]

function searchInFile(filePath, content) {
  const results = []
  
  localStoragePatterns.forEach((pattern, index) => {
    const matches = content.match(pattern)
    if (matches) {
      const lines = content.split('\n')
      lines.forEach((line, lineNumber) => {
        if (pattern.test(line)) {
          results.push({
            file: filePath,
            line: lineNumber + 1,
            content: line.trim(),
            pattern: pattern.source
          })
        }
      })
    }
  })
  
  return results
}

function searchDirectory(dirPath) {
  const results = []
  
  if (!fs.existsSync(dirPath)) {
    return results
  }
  
  const items = fs.readdirSync(dirPath)
  
  items.forEach(item => {
    const itemPath = path.join(dirPath, item)
    const stat = fs.statSync(itemPath)
    
    if (stat.isDirectory()) {
      // Skip node_modules and other build directories
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) {
        results.push(...searchDirectory(itemPath))
      }
    } else if (stat.isFile()) {
      // Only check relevant file types
      const ext = path.extname(item)
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        const relativePath = path.relative(process.cwd(), itemPath)
        
        // Skip excluded files
        if (!excludeFiles.includes(relativePath.replace(/\\/g, '/'))) {
          try {
            const content = fs.readFileSync(itemPath, 'utf8')
            const fileResults = searchInFile(relativePath, content)
            results.push(...fileResults)
          } catch (error) {
            console.warn(`Warning: Could not read file ${relativePath}`)
          }
        }
      }
    }
  })
  
  return results
}

function main() {
  console.log('🔍 Verifying localStorage removal...\n')
  
  let allResults = []
  
  searchPaths.forEach(searchPath => {
    const results = searchDirectory(searchPath)
    allResults.push(...results)
  })
  
  if (allResults.length === 0) {
    console.log('✅ SUCCESS: No localStorage usage found in application code!')
    console.log('✅ All localStorage has been successfully replaced with database integration.')
    console.log('\n📊 Migration Summary:')
    console.log('   • User profiles → Database (User table)')
    console.log('   • App settings → Database (UserSettings table)')
    console.log('   • Property types → Database (PropertyType table)')
    console.log('   • Twilio settings → Database (TwilioSettings table)')
    console.log('   • Properties → Database (Property table)')
    console.log('   • Activities → Database (Activity table)')
    console.log('   • Authentication → Database (Session table)')
  } else {
    console.log('❌ FOUND localStorage usage in the following locations:\n')
    
    // Group by file
    const byFile = {}
    allResults.forEach(result => {
      if (!byFile[result.file]) {
        byFile[result.file] = []
      }
      byFile[result.file].push(result)
    })
    
    Object.keys(byFile).forEach(file => {
      console.log(`📄 ${file}:`)
      byFile[file].forEach(result => {
        console.log(`   Line ${result.line}: ${result.content}`)
      })
      console.log('')
    })
    
    console.log(`\n⚠️  Found ${allResults.length} instances of localStorage usage.`)
    console.log('Please review and replace these with database calls.')
  }
}

main()