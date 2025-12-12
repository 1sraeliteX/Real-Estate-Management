/**
 * Legacy migration utility - now redirects to new database migration
 */

import { LocalStorageMigration } from './migrateLocalStorage'

export function migratePropertiesData() {
  // Redirect to the new comprehensive migration system
  if (LocalStorageMigration.needsMigration()) {
    LocalStorageMigration.migrateAllData()
  }
}

// Keep the old function name for backward compatibility
export const migrateProperties = migratePropertiesData