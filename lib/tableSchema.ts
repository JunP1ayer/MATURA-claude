// Table schema management utilities
// Separated from API route to follow Next.js best practices

// インメモリストレージ（実際の実装では永続化データベースを使用）
const virtualSchemas: { [tableName: string]: any } = {};

/**
 * Set schema for a specific table
 * @param tableName - The name of the table
 * @param schema - The schema definition
 */
export function setTableSchema(tableName: string, schema: any) {
  virtualSchemas[tableName] = schema;
}

/**
 * Get schema for a specific table
 * @param tableName - The name of the table
 * @returns The schema definition or undefined if not found
 */
export function getTableSchema(tableName: string) {
  return virtualSchemas[tableName];
}

/**
 * Get all table schemas
 * @returns All stored schemas
 */
export function getAllTableSchemas() {
  return { ...virtualSchemas };
}

/**
 * Delete schema for a specific table
 * @param tableName - The name of the table
 */
export function deleteTableSchema(tableName: string) {
  delete virtualSchemas[tableName];
}

/**
 * Check if a table schema exists
 * @param tableName - The name of the table
 * @returns true if schema exists, false otherwise
 */
export function hasTableSchema(tableName: string): boolean {
  return tableName in virtualSchemas;
}