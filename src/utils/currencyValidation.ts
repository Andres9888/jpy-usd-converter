/**
 * Utility functions for validating currency inputs
 */

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