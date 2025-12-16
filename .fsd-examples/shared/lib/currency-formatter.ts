/**
 * Currency Formatter
 * Форматирование валюты (заменяет компонент TengeAmount.vue)
 *
 * ЗАМЕНЯЕТ: src/components/TengeAmount.vue
 *
 * Использование:
 * import { formatTenge, formatCurrency } from '@shared/lib/formatters/currency-formatter'
 * formatTenge(1500) // => "1 500 ₸"
 */

/**
 * Форматирование валюты с заданной локалью и символом
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

/**
 * Форматирование суммы в тенге
 *
 * @example
 * formatTenge(1500) // => "1 500 ₸"
 * formatTenge(1500.50) // => "1 500,5 ₸"
 * formatTenge("2000") // => "2 000 ₸"
 */
export function formatTenge(amount: number | string): string {
  return formatCurrency(amount, '₸', 'ru-RU')
}

/**
 * Парсинг строки валюты в число
 *
 * @example
 * parseCurrency("1 500 ₸") // => 1500
 * parseCurrency("1,500.50 $") // => 1500.50
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d,.-]/g, '').replace(/,/g, '.')
  return parseFloat(cleaned) || 0
}

/**
 * Форматирование разницы валюты (с + или -)
 *
 * @example
 * formatCurrencyDiff(500) // => "+500 ₸"
 * formatCurrencyDiff(-300) // => "-300 ₸"
 */
export function formatCurrencyDiff(amount: number, currency: string = '₸'): string {
  const sign = amount > 0 ? '+' : ''
  return `${sign}${formatCurrency(amount, currency)}`
}
