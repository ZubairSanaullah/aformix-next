import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { CURRENCIES, getSelectedCurrency, setSelectedCurrency as persistSelectedCurrency } from '../utils/currency';

interface Rates {
  [currency: string]: number;
}

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  rates: Rates;
  isLoadingRates: boolean;
}

// Fallback rates if API fails
const fallbackRates: Rates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83,
  PKR: 280,
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>(getSelectedCurrency());
  const [rates, setRates] = useState<Rates>(fallbackRates);
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  // Fetch real-time rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        if (data && data.rates) {
          // We only care about our supported currencies
          const updatedRates: Rates = { ...fallbackRates };
          CURRENCIES.forEach((c) => {
            if (data.rates[c]) {
              updatedRates[c] = data.rates[c];
            }
          });
          setRates(updatedRates);
        }
      } catch (error) {
        console.error('Failed to fetch real-time exchange rates:', error);
      } finally {
        setIsLoadingRates(false);
      }
    };

    fetchRates();
  }, []);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    persistSelectedCurrency(newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, isLoadingRates }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
