/**
 * Date Formatter
 * Улучшенное форматирование дат
 *
 * УЛУЧШАЕТ: src/utils/formatDate.ts
 *
 * Использование:
 * import { formatDate, formatRelativeDate } from '@shared/lib/formatters/date-formatter'
 */

/**
 * Форматирование даты с разными форматами
 *
 * @param date - Дата для форматирования
 * @param format - Формат вывода
 * @returns Отформатированная дата
 *
 * @example
 * formatDate(new Date(), 'short') // => "16.12.2025"
 * formatDate(new Date(), 'medium') // => "16 дек. 2025"
 * formatDate(new Date(), 'long') // => "16 декабря 2025, 14:30"
 * formatDate(new Date(), 'relative') // => "Сегодня"
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'relative' = 'medium'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date'
  }

  const locale = 'ru-RU'

  switch (format) {
    case 'short':
      return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(dateObj)

    case 'long':
      return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj)

    case 'relative':
      return formatRelativeDate(dateObj)

    case 'medium':
    default:
      return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(dateObj)
  }
}

/**
 * Форматирование относительной даты (timeAgo)
 *
 * @example
 * formatRelativeDate(new Date()) // => "Сегодня"
 * formatRelativeDate(yesterdayDate) // => "Вчера"
 * formatRelativeDate(weekAgoDate) // => "7 дней назад"
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSeconds < 60) return 'Только что'
  if (diffMinutes < 60) return `${diffMinutes} мин. назад`
  if (diffHours < 24) return `${diffHours} ч. назад`
  if (diffDays === 0) return 'Сегодня'
  if (diffDays === 1) return 'Вчера'
  if (diffDays < 7) return `${diffDays} дней назад`
  if (diffWeeks < 4) return `${diffWeeks} недель назад`
  if (diffMonths < 12) return `${diffMonths} месяцев назад`
  if (diffYears === 1) return '1 год назад'
  if (diffYears < 5) return `${diffYears} года назад`

  return formatDate(date, 'medium')
}

/**
 * Форматирование времени
 *
 * @example
 * formatTime(new Date()) // => "14:30"
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

/**
 * Форматирование даты и времени
 *
 * @example
 * formatDateTime(new Date()) // => "16.12.2025 14:30"
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

/**
 * Проверка, является ли дата сегодняшней
 */
export function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Проверка, является ли дата вчерашней
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
}
