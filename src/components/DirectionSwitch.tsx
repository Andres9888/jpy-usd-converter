import React, { useState, useEffect } from 'react';
import { DirectionSwitchProps } from '../types';

const DirectionSwitch: React.FC<DirectionSwitchProps> = ({
  isJpyToUsd,
  toggleDirection,
}) => {
  // Animation state for switch transition
  const [animating, setAnimating] = useState(false);
  // State to track keyboard instruction visibility
  const [showKeyboardHint, setShowKeyboardHint] = useState(false);

  // Handle keyboard shortcuts globally
  useEffect(() => {
    const handleGlobalKeypress = (e: KeyboardEvent) => {
      // Alt+S shortcut for swapping direction
      if (e.altKey && e.key === 's') {
        setAnimating(true);
        toggleDirection();
        // Show animation for a brief period
        setTimeout(() => setAnimating(false), 500);
      }
    };

    window.addEventListener('keydown', handleGlobalKeypress);
    return () => window.removeEventListener('keydown', handleGlobalKeypress);
  }, [toggleDirection]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setAnimating(true);
      toggleDirection();
      // Show animation for a brief period
      setTimeout(() => setAnimating(false), 500);
    }
  };

  const handleClick = () => {
    setAnimating(true);
    toggleDirection();
    // Show animation for a brief period
    setTimeout(() => setAnimating(false), 500);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Currency direction labels in a balanced layout */}
      <div className="flex items-center justify-center w-full">
        <div
          className={`flex-1 text-center transition-all duration-300 ${
            isJpyToUsd
              ? 'text-japan-red font-medium scale-105'
              : 'text-japan-slate hover:text-japan-red/70'
          }`}
        >
          <div className="text-2xl mb-1 font-display font-semibold flex justify-center items-center">
            <span className="mr-1">JPY</span>
            <span className={`text-xs bg-japan-red text-white rounded-full w-5 h-5 flex items-center justify-center
              transition-all duration-300 ${animating && isJpyToUsd ? 'animate-pulse' : ''}`}>
              ¥
            </span>
          </div>
          <div className="text-xs">日本円 (Japanese Yen)</div>
        </div>

        {/* Animated decorative arrow that changes direction */}
        <div className="mx-6">
          <svg
            className={`h-6 w-10 transition-all duration-500 ${
              isJpyToUsd
                ? ''
                : 'transform rotate-180'
            } ${animating ? 'animate-bounce' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke={isJpyToUsd ? 'rgba(188, 0, 45, 0.7)' : 'rgba(0, 100, 0, 0.7)'}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>

        <div
          className={`flex-1 text-center transition-all duration-300 ${
            !isJpyToUsd
              ? 'text-usd-green font-medium scale-105'
              : 'text-japan-slate hover:text-usd-green/70'
          }`}
        >
          <div className="text-2xl mb-1 font-display font-semibold flex justify-center items-center">
            <span className="mr-1">USD</span>
            <span className={`text-xs bg-usd-green text-white rounded-full w-5 h-5 flex items-center justify-center
              transition-all duration-300 ${animating && !isJpyToUsd ? 'animate-pulse' : ''}`}>
              $
            </span>
          </div>
          <div className="text-xs">US Dollar</div>
        </div>
      </div>

      {/* Direction toggle button */}
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setShowKeyboardHint(true)}
        onMouseLeave={() => setShowKeyboardHint(false)}
        onFocus={() => setShowKeyboardHint(true)}
        onBlur={() => setShowKeyboardHint(false)}
        className={`mt-5 bg-gradient-to-r ${
          isJpyToUsd
            ? 'from-japan-red/10 to-usd-green/10 hover:from-japan-red/20 hover:to-usd-green/20'
            : 'from-usd-green/10 to-japan-red/10 hover:from-usd-green/20 hover:to-japan-red/20'
        } px-4 py-2 rounded-full
          text-sm ${isJpyToUsd ? 'text-japan-red' : 'text-usd-green'}
          transition-all duration-300 focus:outline-none focus:ring-2 ${
            isJpyToUsd ? 'focus:ring-japan-red' : 'focus:ring-usd-green'
          } focus:ring-opacity-50 relative group`}
        role="switch"
        aria-checked={!isJpyToUsd}
        aria-label="Toggle conversion direction"
        tabIndex={0}
      >
        <div className="flex items-center">
          <svg
            className={`h-4 w-4 mr-1.5 ${animating ? 'animate-spin' : ''}`}
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

        {/* Keyboard shortcut hint */}
        {showKeyboardHint && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-black/75 text-white rounded shadow-lg whitespace-nowrap animate-fade-in">
            Shortcut: Alt+S
          </div>
        )}
      </button>
    </div>
  );
};

export default DirectionSwitch;