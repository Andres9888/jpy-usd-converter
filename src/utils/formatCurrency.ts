/**
 * Formats a currency amount based on the currency code
 *
 * @param amount - The amount to format
 * @param currencyCode - The currency code ('JPY' or 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number | null,
  currencyCode: 'JPY' | 'USD'
): string => {
  if (amount === null) return '';

  const numericAmount = typeof amount === 'string'
    ? parseFloat(amount)
    : amount;

  if (isNaN(numericAmount)) {
    return '';
  }

  if (currencyCode === 'JPY') {
    // JPY typically doesn't use decimal places
    return `¥${Math.round(numericAmount).toLocaleString()}`;
  } else {
    // USD uses 2 decimal places
    return `$${numericAmount.toFixed(2)}`;
  }
};

/**
 * Formats a date string for display
 *
 * @param dateString - The date string to format
 * @returns Formatted date string or empty string if null
 */
export const formatDate = (
  dateString: string | null
): string => {
  if (!dateString) return '';

  // Check if it's a backup API source
  const isBackupSource = dateString.includes('backup');

  // Remove the '(backup)' text if present for display purposes
  const cleanDateString = isBackupSource
    ? dateString.replace(' (backup)', '')
    : dateString;

  return cleanDateString;
};

/**
 * Generates a string representation for copying to clipboard
 *
 * @param amount - The amount to format
 * @param currencyCode - The currency code
 * @returns A string formatted for clipboard copy
 */
export const formatForClipboard = (
  amount: number | null,
  currencyCode: 'JPY' | 'USD'
): string => {
  if (amount === null) return '';

  const symbol = currencyCode === 'JPY' ? '¥' : '$';

  if (currencyCode === 'JPY') {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  } else {
    return `${symbol}${amount.toFixed(2)}`;
  }
};

// All utility functions are exported with 'export const' above