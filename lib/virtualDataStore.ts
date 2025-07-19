// Virtual data storage utilities
// Separated from API route to follow Next.js best practices

// インメモリデータストレージ（実際の実装では永続化データベースを使用）
let virtualData: { [tableName: string]: any[] } = {};

/**
 * Get data for a specific table
 * @param tableName - The name of the table
 * @returns Array of data or empty array if table doesn't exist
 */
export function getTableData(tableName: string): any[] {
  return virtualData[tableName] || [];
}

/**
 * Set data for a specific table
 * @param tableName - The name of the table
 * @param data - The data array to set
 */
export function setTableData(tableName: string, data: any[]) {
  virtualData[tableName] = data;
}

/**
 * Initialize table if it doesn't exist
 * @param tableName - The name of the table
 */
export function initializeTable(tableName: string) {
  if (!virtualData[tableName]) {
    virtualData[tableName] = [];
  }
}

/**
 * Add item to table
 * @param tableName - The name of the table
 * @param item - The item to add
 */
export function addTableItem(tableName: string, item: any) {
  initializeTable(tableName);
  virtualData[tableName].push(item);
}

/**
 * Update item in table by index
 * @param tableName - The name of the table
 * @param index - The index of the item
 * @param item - The updated item
 */
export function updateTableItem(tableName: string, index: number, item: any) {
  if (virtualData[tableName] && virtualData[tableName][index]) {
    virtualData[tableName][index] = item;
  }
}

/**
 * Remove item from table by index
 * @param tableName - The name of the table
 * @param index - The index to remove
 */
export function removeTableItem(tableName: string, index: number) {
  if (virtualData[tableName]) {
    virtualData[tableName].splice(index, 1);
  }
}

/**
 * Get all virtual data
 * @returns All stored data
 */
export function getAllVirtualData() {
  return { ...virtualData };
}