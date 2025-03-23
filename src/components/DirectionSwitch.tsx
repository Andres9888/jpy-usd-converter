import React from 'react';
import { DirectionSwitchProps } from '../types';

const DirectionSwitch: React.FC<DirectionSwitchProps> = ({
  isJpyToUsd,
  toggleDirection,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleDirection();
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Currency direction labels in a balanced layout */}
      <div className="flex items-center justify-center w-full">
        <div className={`flex-1 text-center transition-all duration-300 ${isJpyToUsd ? 'text-japan-red font-medium scale-105' : 'text-japan-slate'}`}>
          <div className="text-2xl mb-1 font-display font-semibold flex justify-center items-center">
            <span className="mr-1">JPY</span>
            <span className="text-xs bg-japan-red text-white rounded-full w-5 h-5 flex items-center justify-center">¥</span>
          </div>
          <div className="text-xs">日本円 (Japanese Yen)</div>
        </div>

        {/* Decorative arrow that changes direction */}
        <div className="mx-6">
          <svg
            className={`h-6 w-10 transition-all duration-300 ${isJpyToUsd ? '' : 'transform rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke={isJpyToUsd ? 'rgba(188, 0, 45, 0.7)' : 'rgba(18, 140, 69, 0.7)'}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>

        <div className={`flex-1 text-center transition-all duration-300 ${!isJpyToUsd ? 'text-usd-green font-medium scale-105' : 'text-japan-slate'}`}>
          <div className="text-2xl mb-1 font-display font-semibold flex justify-center items-center">
            <span className="mr-1">USD</span>
            <span className="text-xs bg-usd-green text-white rounded-full w-5 h-5 flex items-center justify-center">$</span>
          </div>
          <div className="text-xs">US Dollar</div>
        </div>
      </div>

      {/* Direction toggle button */}
      <button
        type="button"
        onClick={toggleDirection}
        onKeyDown={handleKeyDown}
        className={`mt-5 bg-gradient-to-r ${isJpyToUsd ? 'from-japan-red/10 to-usd-green/10 hover:from-japan-red/20 hover:to-usd-green/20' : 'from-usd-green/10 to-japan-red/10 hover:from-usd-green/20 hover:to-japan-red/20'} px-4 py-2 rounded-full
          text-sm ${isJpyToUsd ? 'text-japan-red' : 'text-usd-green'}
          transition-colors duration-300 focus:outline-none focus:ring-2 ${isJpyToUsd ? 'focus:ring-japan-red' : 'focus:ring-usd-green'} focus:ring-opacity-50`}
        role="switch"
        aria-checked={!isJpyToUsd}
        aria-label="Toggle conversion direction"
        tabIndex={0}
      >
        <div className="flex items-center">
          <svg
            className="h-4 w-4 mr-1.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          Swap Direction
        </div>
      </button>
    </div>
  );
};

export default DirectionSwitch;