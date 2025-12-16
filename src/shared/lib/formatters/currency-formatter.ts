/**
 * Currency Formatter
 * Форматирование валюты (заменяет компонент TengeAmount.vue)
 *
 * ЗАМЕНЯЕТ: src/components/TengeAmount.vue
 */

export function formatCurrency(
  amount: number | string,
  currency: string = '₸',
  locale: string = 'ru-RU'
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numAmount)) {
    return `0 ${currency}`
  }

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numAmount)

  return `${formatted} ${currency}`
}

export function formatTenge(amount: number | string): string {
  return formatCurrency(amount, '₸', 'ru-RU')
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d,.-]/g, '').replace(/,/g, '.')
  return parseFloat(cleaned) || 0
}
