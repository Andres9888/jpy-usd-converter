import React, { useState, useEffect, useCallback } from 'react';
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
  // Add state for highlighting output on change
  const [outputChanged, setOutputChanged] = useState<boolean>(false);
  // Add history state
  const [conversionHistory, setConversionHistory] = useState<Array<{
    input: string;
    output: string;
    fromCurrency: CurrencyCode;
    toCurrency: CurrencyCode;
    timestamp: Date;
  }>>([]);
  // Add state for showing/hiding history
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Get exchange rate data using custom hook
  const { rate, isLoading, error: rateError, lastUpdated, refreshRate, direction } = useExchangeRate(
    isJpyToUsd ? 'JPY_TO_USD' : 'USD_TO_JPY'
  );

  // Define the source and target currencies based on conversion direction
  const sourceCurrency: CurrencyCode = isJpyToUsd ? 'JPY' : 'USD';
  const targetCurrency: CurrencyCode = isJpyToUsd ? 'USD' : 'JPY';

  // Toggle between JPY to USD and USD to JPY
  const handleToggleDirection = useCallback(() => {
    setIsJpyToUsd(prev => !prev);
    // Reset input/output when changing direction
    setInputAmount('');
    setOutputAmount('');
    setInputError(null);
    setShowHistory(false);
  }, []);

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

        // Only trigger animation when output changes to a non-empty value
        if (formattedResult !== outputAmount && formattedResult !== '') {
          setOutputChanged(true);
          setTimeout(() => setOutputChanged(false), 800);
        }

        setOutputAmount(formattedResult);
        setInputError(null);

        // Add to history if we have a successful conversion
        if (numericAmount > 0 && result > 0) {
          // Add to beginning of history array (most recent first)
          setConversionHistory(prev => {
            const newHistory = [
              {
                input: inputAmount,
                output: formattedResult,
                fromCurrency: sourceCurrency,
                toCurrency: targetCurrency,
                timestamp: new Date()
              },
              ...prev
            ];
            // Limit history to 10 items
            return newHistory.slice(0, 10);
          });
        }
      } catch (err) {
        setInputError('Error converting currency');
        setOutputAmount('');
      }
    } else {
      setOutputAmount('');
    }
  }, [inputAmount, rate, isJpyToUsd, sourceCurrency, targetCurrency, outputAmount]);

  // Format the API error message for user-friendly display
  const getErrorMessage = (error: string) => {
    if (error.includes('Primary API failed, using backup API')) {
      return 'Using alternate data source. Rate may be slightly delayed.';
    }
    return error;
  };

  // Handle history item click to restore a previous conversion
  const handleHistoryItemClick = (historyItem: {
    input: string;
    fromCurrency: CurrencyCode;
    toCurrency: CurrencyCode;
  }) => {
    // Only restore if the directions match
    if (
      (isJpyToUsd && historyItem.fromCurrency === 'JPY' && historyItem.toCurrency === 'USD') ||
      (!isJpyToUsd && historyItem.fromCurrency === 'USD' && historyItem.toCurrency === 'JPY')
    ) {
      setInputAmount(historyItem.input);
    } else {
      // If directions don't match, toggle direction and set input in the next render cycle
      handleToggleDirection();
      setTimeout(() => {
        setInputAmount(historyItem.input);
      }, 100);
    }
    // Hide history after selecting
    setShowHistory(false);
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

        {/* Recent conversions history button */}
        {conversionHistory.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              aria-expanded={showHistory}
              aria-controls="conversion-history"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {showHistory ? 'Hide recent conversions' : 'Show recent conversions'}
            </button>

            {/* History dropdown */}
            {showHistory && (
              <div id="conversion-history" className="mt-2 bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto animate-slide-up">
                <h3 className="text-xs font-medium text-gray-500 mb-2">Recent Conversions</h3>
                <ul className="space-y-1">
                  {conversionHistory.map((item, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleHistoryItemClick(item)}
                        className="w-full text-left text-sm p-2 rounded hover:bg-gray-100 flex justify-between items-center"
                      >
                        <span>
                          {item.input} {item.fromCurrency} → {item.output} {item.toCurrency}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

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