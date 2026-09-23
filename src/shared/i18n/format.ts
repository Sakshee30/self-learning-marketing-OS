function resolveLocale(locale?: string | undefined) {
  if (locale) return locale;
  if (typeof navigator !== "undefined" && navigator.language) return navigator.language;
  return "en-US";
}

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale?: string | undefined
) {
  return new Intl.NumberFormat(resolveLocale(locale), options).format(value);
}

export function formatCurrency(
  value: number,
  currency: string,
  locale?: string | undefined
) {
  return new Intl.NumberFormat(resolveLocale(locale), {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatPercent(
  value: number,
  locale?: string | undefined,
  maximumFractionDigits = 1
) {
  return new Intl.NumberFormat(resolveLocale(locale), {
    style: "percent",
    maximumFractionDigits
  }).format(value);
}

export function formatDateTime(
  value: string | number | Date,
  options: Intl.DateTimeFormatOptions = {},
  locale?: string | undefined
) {
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
    ...options
  }).format(new Date(value));
}
