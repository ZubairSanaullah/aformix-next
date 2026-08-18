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

const CACHE_KEY = "aformix_exchange_rates";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>(getSelectedCurrency());
  const [rates, setRates] = useState<Rates>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.rates) {
            return parsed.rates;
          }
        }
      } catch (e) {
        // ignore storage error
      }
    }
    return fallbackRates;
  });
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // Fetch real-time rates with caching
  useEffect(() => {
    let isCancelled = false;

    const fetchRates = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.rates) {
            setRates(parsed.rates);
            return;
          }
        }

        setIsLoadingRates(true);
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        if (data && data.rates && !isCancelled) {
          const updatedRates: Rates = { ...fallbackRates };
          CURRENCIES.forEach((c) => {
            if (data.rates[c]) {
              updatedRates[c] = data.rates[c];
            }
          });
          setRates(updatedRates);
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), rates: updatedRates })
          );
        }
      } catch (error) {
        console.error('Failed to fetch real-time exchange rates:', error);
      } finally {
        if (!isCancelled) setIsLoadingRates(false);
      }
    };

    // Defer network request so it doesn't block critical hydration
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = (window as any).requestIdleCallback(fetchRates);
      return () => {
        isCancelled = true;
        (window as any).cancelIdleCallback?.(handle);
      };
    } else {
      const timer = setTimeout(fetchRates, 1500);
      return () => {
        isCancelled = true;
        clearTimeout(timer);
      };
    }
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
