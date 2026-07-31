export const CURRENCIES = ["USD", "EUR", "GBP", "INR", "PKR"] as const;

export const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  PKR: "₨",
};

// Default rates are relative to USD (1 USD = rates[currency])
// We keep this for fallback and backward compatibility
export const fallbackRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83,
  PKR: 280,
};

export const CURRENCY_LOCALSTORAGE_KEY = "selectedCurrency";

export const getSelectedCurrency = (): string => {
  try {
    const v = localStorage.getItem(CURRENCY_LOCALSTORAGE_KEY);
    return v || "USD";
  } catch (e) {
    return "USD";
  }
};

export const setSelectedCurrency = (c: string) => {
  try {
    localStorage.setItem(CURRENCY_LOCALSTORAGE_KEY, c);
  } catch (e) {
    // ignore
  }
};

export function extractNumberFromString(s: string): number | null {
  if (!s) return null;
  const m = s.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

export function convertUsdTo(amountUsd: number, currency: string, customRates?: Record<string, number>): number {
  const currentRates = customRates || fallbackRates;
  const rate = currentRates[currency] ?? 1;
  return amountUsd * rate;
}

export function formatCurrencyAmount(value: number, currency: string, maximumFractionDigits = 0): string {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits, minimumFractionDigits: maximumFractionDigits }).format(value);
  } catch (e) {
    // fallback
    const symbol = currencySymbols[currency] || "";
    return `${symbol}${value.toFixed(maximumFractionDigits)}`;
  }
}

// Convert a price-like string (e.g. "$499", "$50/mo (12 months)") to the selected currency and preserve suffixes.
export function convertAndFormatPriceString(priceStr: string, currency?: string, customRates?: Record<string, number>): string {
  const target = currency || getSelectedCurrency();
  const num = extractNumberFromString(priceStr);
  if (num === null) return priceStr;
  const converted = convertUsdTo(num, target, customRates);
  const formatter = formatCurrencyAmount(converted, target, 0);

  // Replace the first occurrence of currency symbol+number or number with the formatted currency
  // Matches optional leading non-digits followed by a numeric token (allowing commas/decimals)
  try {
    return priceStr.replace(/[^0-9]*[0-9][0-9\.,]*/, formatter);
  } catch (e) {
    return formatter;
  }
}

// Sum an array of bonus value strings and return formatted total in selected currency
export function sumAndFormatBonusValues(values: string[], currency?: string, customRates?: Record<string, number>): string {
  const target = currency || getSelectedCurrency();
  const numsUsd = values.map((v) => extractNumberFromString(v) ?? 0);
  const totalUsd = numsUsd.reduce((a, b) => a + b, 0);
  const converted = convertUsdTo(totalUsd, target, customRates);
  return formatCurrencyAmount(converted, target, 0);
}

export default {};
