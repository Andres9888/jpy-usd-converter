import React from 'react';
import { ExchangeRateDisplayProps } from '../types';
import { formatCurrency, formatDate } from '../utils/formatCurrency';

const ExchangeRateDisplay: React.FC<ExchangeRateDisplayProps> = ({
  rate,
  isLoading,
  isJpyToUsd,
  lastUpdated,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-japan-red/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-japan-indigo/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-usd-green/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <div className="ml-3 text-sm text-japan-slate">Fetching latest rates...</div>
      </div>
    );
  }

  if (!rate) {
    return (
      <div className="text-center p-4 rounded-lg bg-red-50 border border-red-100">
        <svg className="h-6 w-6 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-700 font-medium">Unable to load exchange rate.</p>
        <p className="text-red-600 text-xs mt-1">Please try again later.</p>
      </div>
    );
  }

  // Get colors based on the currency direction
  const fromColor = isJpyToUsd ? 'text-japan-red' : 'text-usd-green';
  const toColor = isJpyToUsd ? 'text-usd-green' : 'text-japan-red';

  // Symbols for each currency
  const jpySymbol = '¥';
  const usdSymbol = '$';

  // Format the raw rate value without currency symbols for display
  const formattedRate = isJpyToUsd
    ? formatCurrency(1 / rate, 'USD')
    : formatCurrency(rate, 'JPY');

  // Remove the currency symbol from the formatted rate for custom display
  const rateWithoutSymbol = formattedRate.replace(/[$¥]/, '');

  // Check if we're using the backup API
  const isUsingBackup = lastUpdated?.includes('backup');

  return (
    <div className="flex flex-col items-center">
      {/* Current Rate Display */}
      <div className="flex flex-col sm:flex-row items-center justify-center">
        <div className="flex items-center font-display font-medium">
          <span className={`${fromColor} text-xl mr-1`}>
            {isJpyToUsd ? jpySymbol : usdSymbol}1
          </span>
          <span className="mx-1 text-gray-400">=</span>
          <span className={`${toColor} text-xl`}>
            {isJpyToUsd ? usdSymbol : jpySymbol}{rateWithoutSymbol}
          </span>
        </div>

        <div className="sm:ml-4 mt-1 sm:mt-0 px-2 py-0.5 rounded-full bg-gradient-to-r from-japan-red/20 to-usd-green/20 text-gray-700 text-xs font-medium border border-gray-200">
          {isUsingBackup ? 'Alternate Source' : 'Live Rate'}
        </div>
      </div>

      {/* Last Updated Information */}
      <div className="mt-2 flex items-center">
        <div className="flex items-center text-gray-500 text-xs">
          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Last updated: {lastUpdated ? formatDate(lastUpdated) : 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default ExchangeRateDisplay;