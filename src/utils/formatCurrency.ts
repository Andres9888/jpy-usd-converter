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
 * Validates if the input string is a valid currency input
 * Allows: empty string, digits, one decimal point, and limits decimal places
 *
 * @param input - The string to validate
 * @param currencyCode - The currency code to validate against (defaults to any)
 * @returns Boolean indicating if the input is valid
 */
export const isValidCurrencyInput = (
  input: string,
  currencyCode?: 'JPY' | 'USD'
): boolean => {
  // Allow empty string for clearing input
  if (input === '') return true;

  // Basic regex for currency format
  // Allows: digits, one decimal point, and appropriate decimal places
  const generalPattern = /^(\d+)(\.\d{0,2})?$/;

  // If JPY is specified, don't allow decimal places
  const jpyPattern = /^\d+$/;

  if (currencyCode === 'JPY') {
    return jpyPattern.test(input);
  }

  return generalPattern.test(input);
};

/**
 * Formats a number with thousand separators as the user types
 *
 * @param input - The raw input string
 * @returns The formatted string with thousand separators
 */
export const formatWithThousandSeparators = (input: string): string => {
  // Remove any non-digit and non-decimal characters
  const cleanInput = input.replace(/[^\d.]/g, '');

  // Split by decimal point
  const parts = cleanInput.split('.');

  // Format the integer part with thousand separators
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Return the formatted string
  return parts.join('.');
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