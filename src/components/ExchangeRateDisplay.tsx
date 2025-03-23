import React, { useEffect, useState } from 'react';
import { ExchangeRateDisplayProps } from '../types';
import { formatCurrency, formatDate } from '../utils/formatCurrency';

const ExchangeRateDisplay: React.FC<ExchangeRateDisplayProps> = ({
  rate,
  isLoading,
  isJpyToUsd,
  lastUpdated,
}) => {
  // State for animation when rate changes
  const [animate, setAnimate] = useState(false);
  // State for countdown timer until next update (simulated)
  const [nextUpdateTime, setNextUpdateTime] = useState<number>(60);

  // Trigger animation when rate changes
  useEffect(() => {
    if (rate !== null) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [rate]);

  // Simulate countdown for next rate update
  useEffect(() => {
    if (rate !== null && !isLoading) {
      const interval = setInterval(() => {
        setNextUpdateTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [rate, isLoading]);

  // Check if using backup source
  const isUsingBackup = lastUpdated?.includes('backup');

  // Animation class for rate changes
  const animationClass = animate
    ? isJpyToUsd
      ? 'animate-pulse-japan'
      : 'animate-pulse-usd'
    : '';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4 animate-fade-in">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-japan-red/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-japan-indigo/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-usd-green/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <div className="ml-3 text-sm text-japan-slate">Fetching latest rates...</div>
      </div>
    );
  }

  if (rate === null) {
    return (
      <div className="flex justify-center items-center py-4 text-orange-600 text-sm animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Rate unavailable. Please try again later.
      </div>
    );
  }

  const sourceCurrency = isJpyToUsd ? 'JPY' : 'USD';
  const targetCurrency = isJpyToUsd ? 'USD' : 'JPY';
  const formattedRate = isJpyToUsd
    ? rate.toFixed(6)
    : rate.toFixed(2);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-center">
          {/* Exchange rate display */}
          <div className={`text-lg font-medium ${animationClass}`}>
            <span className="text-gray-600 mr-1">Rate:</span>
            <span className={isJpyToUsd ? 'text-japan-red' : 'text-usd-green'}>
              1 {sourceCurrency} = {formattedRate} {targetCurrency}
            </span>
          </div>

          {/* Source indicator */}
          <div className={`ml-2 px-1.5 py-0.5 text-xs rounded-md
            ${isUsingBackup
              ? 'bg-orange-100 text-orange-800'
              : 'bg-green-100 text-green-800'}`}
          >
            {isUsingBackup ? 'Alternate Source' : 'Live Rate'}
          </div>
        </div>

        {/* Last updated timestamp */}
        {lastUpdated && (
          <div className="mt-1 sm:mt-0 text-xs text-gray-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Updated: {formatDate(lastUpdated)}</span>
            <span className="mx-1">•</span>
            <span>Next update in: {nextUpdateTime}s</span>
          </div>
        )}
      </div>

      {/* Trend indicator (simplified, would use real data in production) */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">Today's trend</div>
          <div className={`flex items-center text-sm ${Math.random() > 0.5 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.random() > 0.5 ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +{(Math.random() * 2).toFixed(2)}%
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
                -{(Math.random() * 2).toFixed(2)}%
              </>
            )}
          </div>
        </div>

        {/* Mini chart (static for demo purposes) */}
        <div className="mt-2 h-10 bg-gray-50 rounded-md overflow-hidden flex items-end">
          {[...Array(24)].map((_, i) => {
            const height = 30 + Math.random() * 70;
            return (
              <div
                key={i}
                className={`w-full h-[${height}%] ${i % 2 === 0 ? 'bg-japan-red/30' : 'bg-usd-green/30'}`}
                style={{ height: `${height}%` }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExchangeRateDisplay;