import React, { useState, useEffect } from 'react';
import { CurrencyInputProps } from '../types';
import { formatForClipboard } from '../utils/formatCurrency';
import { isValidCurrencyInput, formatWithThousandSeparators } from '../utils/currencyValidation';

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  amount,
  setAmount,
  currencyCode,
  label,
  isReadOnly = false,
  hasError = false,
  errorMessage = '',
}) => {
  // State for animation when value changes
  const [animate, setAnimate] = useState(false);
  // State for showing preset buttons
  const [showPresets, setShowPresets] = useState(false);
  // State for copy notification
  const [copied, setCopied] = useState(false);

  // Trigger animation when amount changes
  useEffect(() => {
    if (amount && amount !== '') {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [amount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Validate input before updating state
    if (isValidCurrencyInput(value, currencyCode)) {
      setAmount(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow keyboard navigation
    if (e.key === 'Enter' || e.key === 'Tab') {
      return;
    }
  };

  // Handle preset value selection
  const handlePresetClick = (presetValue: string) => {
    if (!isReadOnly) {
      setAmount(presetValue);
    }
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    if (amount && parseFloat(amount) > 0) {
      const textToCopy = formatForClipboard(parseFloat(amount), currencyCode);
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Define styling based on currency and state
  const inputBgClass = isReadOnly
    ? 'bg-gray-50'
    : 'bg-white';

  const inputBorderClass = hasError
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : currencyCode === 'JPY'
      ? 'border-gray-200 focus:ring-japan-red focus:border-japan-red'
      : 'border-gray-200 focus:ring-usd-green focus:border-usd-green';

  const currencyColor = currencyCode === 'JPY'
    ? 'text-japan-red'
    : 'text-usd-green';

  // Apply background patterns based on currency
  const currencyBgClass = currencyCode === 'JPY'
    ? 'bg-sakura-pattern bg-contain'
    : 'bg-dollar-pattern bg-contain';

  // Animation classes
  const animationClass = animate ? (
    currencyCode === 'JPY'
      ? 'animate-pulse-japan'
      : 'animate-pulse-usd'
  ) : '';

  // Generate preset values based on currency
  const presetValues = currencyCode === 'JPY'
    ? ['1000', '5000', '10000', '50000']
    : ['10', '50', '100', '500'];

  return (
    <div>
      <div className={`relative rounded-xl overflow-hidden transition-all duration-300
        shadow-soft hover:shadow-md ${isReadOnly ? '' : currencyCode === 'JPY' ? 'hover:border-japan-red' : 'hover:border-usd-green'}
        border ${inputBorderClass} ${currencyBgClass}`}
      >
        {/* Currency symbol and code */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className={`${currencyColor} font-medium text-lg ${animationClass}`}>
            {currencyCode === 'JPY' ? '¥' : '$'}
          </span>
        </div>

        {/* Input field */}
        <input
          type="text"
          id={`currency-input-${currencyCode}`}
          className={`input-field block w-full pl-10 pr-16 py-4
            text-xl font-medium focus:outline-none rounded-xl
            ${inputBgClass} ${hasError ? 'text-red-900' : 'text-gray-800'}
            transition-all duration-300 focus:ring-2 focus:ring-opacity-50 ${animationClass}`}
          placeholder="0"
          value={amount}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => !isReadOnly && setShowPresets(true)}
          onBlur={() => setTimeout(() => setShowPresets(false), 200)}
          readOnly={isReadOnly}
          aria-label={`${label} in ${currencyCode}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${currencyCode}-error` : undefined}
          tabIndex={0}
        />

        {/* Currency code badge */}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          <span
            className={`${currencyColor} text-sm font-bold px-1.5 rounded`}
            id="currency-label"
          >
            {currencyCode}
          </span>

          {/* Copy button (only for output) */}
          {isReadOnly && amount && parseFloat(amount) > 0 && (
            <button
              type="button"
              onClick={handleCopy}
              className={`ml-2 text-gray-500 hover:${currencyCode === 'JPY' ? 'text-japan-red' : 'text-usd-green'}
                focus:outline-none focus:ring-2 focus:ring-opacity-50 p-1 rounded-full transition-colors duration-200`}
              aria-label="Copy value to clipboard"
              tabIndex={0}
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error message */}
      {hasError && (
        <p className="mt-2 text-sm text-red-600" id={`${currencyCode}-error`}>
          {errorMessage}
        </p>
      )}

      {/* Preset buttons - only show for input field, not read-only fields */}
      {!isReadOnly && showPresets && (
        <div className="mt-3 flex flex-wrap gap-2 transition-all duration-300 opacity-100 transform translate-y-0 ease-out">
          {presetValues.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handlePresetClick(value)}
              className={`text-sm px-3 py-1.5 rounded-lg border transition-all duration-200
                ${currencyCode === 'JPY'
                  ? 'border-japan-red/30 text-japan-red hover:bg-japan-red hover:text-white'
                  : 'border-usd-green/30 text-usd-green hover:bg-usd-green hover:text-white'}`}
              aria-label={`Set amount to ${currencyCode === 'JPY' ? '¥' : '$'}${value}`}
              tabIndex={0}
            >
              {currencyCode === 'JPY' ? '¥' : '$'}{formatWithThousandSeparators(value)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencyInput;