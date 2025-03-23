import React from 'react';
import { CurrencyInputProps } from '../types';
import { isValidCurrencyInput } from '../utils/formatCurrency';

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  amount,
  setAmount,
  currencyCode,
  label,
  isReadOnly = false,
  hasError = false,
  errorMessage = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Validate input before updating state
    if (isValidCurrencyInput(value)) {
      setAmount(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow keyboard navigation
    if (e.key === 'Enter' || e.key === 'Tab') {
      return;
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

  return (
    <div>
      <div className={`relative rounded-xl overflow-hidden transition-all duration-200
        shadow-soft hover:shadow-md ${isReadOnly ? '' : currencyCode === 'JPY' ? 'hover:border-japan-red' : 'hover:border-usd-green'}
        border ${inputBorderClass} ${currencyBgClass}`}
      >
        {/* Currency symbol and code */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className={`${currencyColor} font-medium text-lg`}>
            {currencyCode === 'JPY' ? '¥' : '$'}
          </span>
        </div>

        {/* Input field */}
        <input
          type="text"
          id={`currency-input-${currencyCode}`}
          className={`block w-full pl-10 pr-16 py-4
            text-xl font-medium focus:outline-none rounded-xl
            ${inputBgClass} ${hasError ? 'text-red-900' : 'text-gray-800'}
            transition-all duration-200 focus:ring-2 focus:ring-opacity-50`}
          placeholder="0"
          value={amount}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          readOnly={isReadOnly}
          aria-label={`${label} in ${currencyCode}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${currencyCode}-error` : undefined}
          tabIndex={0}
        />

        {/* Currency code badge */}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <span
            className={`${currencyColor} text-sm font-bold px-1.5 rounded`}
            id="currency-label"
          >
            {currencyCode}
          </span>
        </div>
      </div>

      {/* Error message */}
      {hasError && (
        <p className="mt-2 text-sm text-red-600" id={`${currencyCode}-error`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default CurrencyInput;