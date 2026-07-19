/**
 * Extracts the maximum sequence number from a list of items based on a specific field.
 * For example, if items have itemCode 'ITEM-0001', 'ITEM-0005', it will return 6.
 * @param items Array of items
 * @param fieldName The field to extract the string from
 * @returns The next sequence number (max + 1)
 */
export function getNextSequenceNumber<T>(items: T[], fieldName: keyof T, prefix?: string): number {
  if (!items || items.length === 0) return 1;

  let maxNum = 0;
  for (const item of items) {
    const val = item[fieldName];
    if (typeof val === 'string') {
      if (prefix && !val.startsWith(prefix)) {
        continue;
      }
      // Extract all digits from the string using regex
      const matches = val.match(/\d+/g);
      if (matches) {
        // Find the last sequence of digits in case there are multiple
        // e.g., 'PRJ-2023-005' -> '005' -> 5
        const lastMatch = matches[matches.length - 1];
        const num = parseInt(lastMatch, 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  }

  return maxNum + 1;
}
