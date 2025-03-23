/**
 * Converts an amount from one currency to another using the provided exchange rate
 *
 * @param amount - The amount to convert
 * @param rate - The exchange rate to use for conversion
 * @param isJpyToUsd - Whether converting from JPY to USD (true) or USD to JPY (false)
 * @returns The converted amount
 */
export const convertCurrency = (
  amount: number,
  rate: number,
  isJpyToUsd: boolean
): number => {
  if (isJpyToUsd) {
    // JPY to USD: divide by rate
    return amount * rate;
  } else {
    // USD to JPY: multiply by rate
    return amount * rate;
  }
};

/**
 * Formats a currency amount based on the currency code
 *
 * @param amount - The amount to format
 * @param currencyCode - The currency code ('JPY' or 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number | string,
  currencyCode: 'JPY' | 'USD'
): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

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