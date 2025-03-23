export type CurrencyCode = 'JPY' | 'USD';

export interface ExchangeRateData {
  result: string;
  provider: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  time_eol_unix: number;
  base_code: string;
  rates: {
    [key: string]: number;
  };
}

export interface CurrencyInputProps {
  amount: string;
  setAmount: (value: string) => void;
  currencyCode: CurrencyCode;
  label: string;
  isReadOnly?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export interface DirectionSwitchProps {
  isJpyToUsd: boolean;
  toggleDirection: () => void;
}

export interface ExchangeRateDisplayProps {
  rate: number | null;
  isLoading: boolean;
  isJpyToUsd: boolean;
  lastUpdated: string | null;
}