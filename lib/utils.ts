import dayjs from "dayjs";

const CURRENCY_SYMBOLS: Record<string, string> = {
  BRL: "R$",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

// Built manually because Hermes ignores `currencyDisplay: "narrowSymbol"`
// and renders USD as "US$" in the pt-BR locale.
export const formatCurrency = (value: number, currency = "BRL"): string => {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  try {
    const amount = new Intl.NumberFormat("pt-br", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    return `${symbol}${amount}`;
  } catch {
    return `${symbol}${value.toFixed(2)}`;
  }
};

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};