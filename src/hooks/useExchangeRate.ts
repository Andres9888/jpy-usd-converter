import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

type ConversionDirection = 'JPY_TO_USD' | 'USD_TO_JPY';

interface ExchangeRateState {
  rate: number | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

/**
 * Custom hook to fetch and handle exchange rates between JPY and USD
 */
const useExchangeRate = (direction: ConversionDirection = 'JPY_TO_USD') => {
  const [state, setState] = useState<ExchangeRateState>({
    rate: null,
    isLoading: true,
    error: null,
    lastUpdated: null
  });

  // Primary API URL
  const PRIMARY_API_URL = 'https://open.er-api.com/v6/latest/';

  // Backup API URL for fallback
  const BACKUP_API_URL = 'https://api.exchangerate.host/latest?base=';

  const fetchExchangeRate = useCallback(async () => {
    setState((prev: ExchangeRateState) => ({ ...prev, isLoading: true, error: null }));

    const baseURL = direction === 'JPY_TO_USD' ? 'JPY' : 'USD';
    const targetCurrency = direction === 'JPY_TO_USD' ? 'USD' : 'JPY';

    try {
      // Try primary API first
      const response = await axios.get(`${PRIMARY_API_URL}${baseURL}`);
      const rate = response.data.rates[targetCurrency];

      if (rate) {
        setState({
          rate,
          isLoading: false,
          error: null,
          lastUpdated: new Date().toLocaleString()
        });
      } else {
        throw new Error('Rate not found in API response');
      }
    } catch (primaryError) {
      console.error('Primary API failed:', primaryError);

      // Try backup API if primary fails
      try {
        const backupResponse = await axios.get(`${BACKUP_API_URL}${baseURL}`);
        const backupRate = backupResponse.data.rates[targetCurrency];

        if (backupRate) {
          setState({
            rate: backupRate,
            isLoading: false,
            error: null,
            lastUpdated: `${new Date().toLocaleString()} (backup)`
          });
        } else {
          throw new Error('Rate not found in backup API response');
        }
      } catch (backupError) {
        console.error('Backup API also failed:', backupError);
        setState({
          rate: null,
          isLoading: false,
          error: 'Failed to fetch exchange rate. Please try again later.',
          lastUpdated: null
        });
      }
    }
  }, [direction]);

  // Fetch exchange rate on mount and when direction changes
  useEffect(() => {
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  // Function to manually refresh the rate
  const refreshRate = () => {
    fetchExchangeRate();
  };

  return {
    ...state,
    refreshRate,
    direction
  };
};

export default useExchangeRate;