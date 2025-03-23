import React, { useState, useEffect } from 'react';
import CurrencyInput from './CurrencyInput';
import DirectionSwitch from './DirectionSwitch';
import ExchangeRateDisplay from './ExchangeRateDisplay';
import useExchangeRate from '../hooks/useExchangeRate';
import { convertCurrency } from '../utils/convertCurrency';
import { CurrencyCode } from '../types';

const CurrencyConverter: React.FC = () => {
  const [inputAmount, setInputAmount] = useState<string>('');
  const [outputAmount, setOutputAmount] = useState<string>('');
  const [isJpyToUsd, setIsJpyToUsd] = useState<boolean>(true);
  const [inputError, setInputError] = useState<string | null>(null);

  // Get exchange rate data using custom hook
  const { rate, isLoading, error: rateError, lastUpdated, refreshRate } = useExchangeRate();

  // Define the source and target currencies based on conversion direction
  const sourceCurrency: CurrencyCode = isJpyToUsd ? 'JPY' : 'USD';
  const targetCurrency: CurrencyCode = isJpyToUsd ? 'USD' : 'JPY';

  // Toggle between JPY to USD and USD to JPY
  const handleToggleDirection = () => {
    setIsJpyToUsd(prev => !prev);
    // Reset input/output when changing direction
    setInputAmount('');
    setOutputAmount('');
    setInputError(null);
  };

  // Convert currency when input changes or rate is loaded/updated
  useEffect(() => {
    if (inputAmount && rate) {
      try {
        // Parse input amount to number for conversion
        const numericAmount = parseFloat(inputAmount);

        if (isNaN(numericAmount)) {
          setInputError('Please enter a valid number');
          setOutputAmount('');
          return;
        }

        // Perform conversion
        const result = convertCurrency(numericAmount, rate, isJpyToUsd);

        // Format result to string with appropriate precision
        // For JPY, we don't show decimals, for USD we show 2 decimal places
        const formattedResult = isJpyToUsd
          ? result.toFixed(2)
          : Math.round(result).toString();

        setOutputAmount(formattedResult);
        setInputError(null);
      } catch (err) {
        setInputError('Error converting currency');
        setOutputAmount('');
      }
    } else {
      setOutputAmount('');
    }
  }, [inputAmount, rate, isJpyToUsd]);

  // Format the API error message for user-friendly display
  const getErrorMessage = (error: string) => {
    if (error.includes('Primary API failed, using backup API')) {
      return 'Using alternate data source. Rate may be slightly delayed.';
    }
    return error;
  };

  return (
    <div className="bg-white rounded-2xl shadow-float overflow-hidden backdrop-blur-sm bg-opacity-90 transition-all duration-300 hover:shadow-lg">
      {/* Currency converter main container */}
      <div className="p-8">
        {/* Direction Switch at the top for better visibility */}
        <div className="mb-8">
          <DirectionSwitch
            isJpyToUsd={isJpyToUsd}
            toggleDirection={handleToggleDirection}
          />
        </div>

        {/* Input and Output in a balanced layout */}
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <div className="space-y-4">
            <h2 className={`text-sm font-medium ${isJpyToUsd ? 'text-japan-red' : 'text-usd-green'}`}>
              {isJpyToUsd ? 'From Japanese Yen (¥)' : 'From US Dollars ($)'}
            </h2>
            <CurrencyInput
              amount={inputAmount}
              setAmount={setInputAmount}
              currencyCode={sourceCurrency}
              label={`Amount in ${sourceCurrency}`}
              hasError={!!inputError}
              errorMessage={inputError || ''}
            />
          </div>

          <div className="space-y-4">
            <h2 className={`text-sm font-medium ${isJpyToUsd ? 'text-usd-green' : 'text-japan-red'}`}>
              {isJpyToUsd ? 'To US Dollars ($)' : 'To Japanese Yen (¥)'}
            </h2>
            <CurrencyInput
              amount={outputAmount}
              setAmount={() => {}} // Read-only field
              currencyCode={targetCurrency}
              label={`Converted amount in ${targetCurrency}`}
              isReadOnly={true}
            />
          </div>
        </div>

        {/* Exchange rate display */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <ExchangeRateDisplay
            rate={rate}
            isLoading={isLoading}
            isJpyToUsd={isJpyToUsd}
            lastUpdated={lastUpdated}
          />
        </div>

        {/* Error message with improved styling */}
        {rateError && (
          <div className="mt-6 p-4 rounded-xl bg-yellow-50 border border-yellow-100 text-sm text-yellow-800">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p>{getErrorMessage(rateError)}</p>
                <button
                  onClick={refreshRate}
                  className="mt-2 text-sm text-japan-red hover:text-japan-red/80 font-medium inline-flex items-center"
                  aria-label="Try again"
                  tabIndex={0}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh rates
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with attribution and refresh button */}
      <div className="px-8 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* API attribution */}
        <div className="text-xs text-japan-slate">
          Data from <span className="font-medium">Exchange Rates API</span>
        </div>

        {/* Refresh button - alternating colors based on direction */}
        <button
          onClick={refreshRate}
          className={`inline-flex items-center px-3 py-1.5 ${
            isJpyToUsd
              ? 'bg-gradient-to-r from-japan-red to-usd-green text-white hover:from-japan-red/90 hover:to-usd-green/90'
              : 'bg-gradient-to-r from-usd-green to-japan-red text-white hover:from-usd-green/90 hover:to-japan-red/90'
          } text-sm rounded-lg transition-colors`}
          aria-label="Refresh exchange rate"
          tabIndex={0}
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Update Rate
        </button>
      </div>
    </div>
  );
};

export default CurrencyConverter;