/**
 * Design Tokens
 * Основано на IBM Carbon Design System
 * Адаптировано для Kainar Admin Dashboard
 */

// ==================== COLORS ====================
export const colors = {
  // Primary - желтый accent для действий
  primary: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308', // main
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },

  // Neutral - основной серый для текста и фонов
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Semantic colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
}

// ==================== SPACING ====================
// 8px базовая единица (согласно Carbon)
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px  - базовая единица
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
}

// ==================== TYPOGRAPHY ====================
export const typography = {
  // Font families
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
  },

  // Font sizes
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px - основной для данных
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px - подзаголовки
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px - заголовки секций
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
  },

  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line heights
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.02em',
    wider: '0.08em', // для uppercase labels
  },
}

// ==================== LAYOUT ====================
export const layout = {
  // Радиусы скругления
  borderRadius: {
    none: '0',
    sm: '0.375rem',   // 6px
    base: '0.5rem',   // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px - для карточек
    '2xl': '1.75rem', // 28px
    '3xl': '2rem',    // 32px - для контейнеров
    full: '9999px',
  },

  // Размеры границ
  borderWidth: {
    0: '0',
    1: '1px',
    2: '2px',
    4: '4px',
  },

  // Тени
  boxShadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
}

// ==================== DATA TABLES ====================
// Специальные токены для таблиц (согласно Carbon)
export const dataTable = {
  // Высота строк
  rowHeight: {
    compact: '32px',  // 32px - компактный режим
    default: '48px',  // 48px - стандартный (рекомендуемый)
    comfortable: '56px', // 56px - комфортный для touch
  },

  // Паддинги ячеек
  cellPadding: {
    x: spacing[4],  // 16px горизонтальный
    y: spacing[3],  // 12px вертикальный
  },

  // Стили
  styles: {
    headerBg: colors.neutral[50],
    headerText: colors.neutral[700],
    rowHoverBg: colors.neutral[50],
    rowSelectedBg: colors.primary[50],
    borderColor: colors.neutral[200],
    zebraStripeBg: colors.neutral[50],
  },
}

// ==================== CARDS ====================
export const card = {
  padding: {
    sm: spacing[4],   // 16px
    md: spacing[6],   // 24px - стандартный
    lg: spacing[8],   // 32px
  },

  borderRadius: layout.borderRadius['3xl'], // 32px
  borderWidth: layout.borderWidth[1],
  borderColor: colors.neutral[200],
  backgroundColor: '#ffffff',
  shadow: layout.boxShadow.none,
}

// ==================== BUTTONS ====================
export const button = {
  borderRadius: layout.borderRadius.full,

  size: {
    sm: {
      height: '32px',
      padding: `${spacing[2]} ${spacing[4]}`,
      fontSize: typography.fontSize.sm[0],
    },
    md: {
      height: '40px',
      padding: `${spacing[2]} ${spacing[5]}`,
      fontSize: typography.fontSize.sm[0],
    },
    lg: {
      height: '48px',
      padding: `${spacing[3]} ${spacing[6]}`,
      fontSize: typography.fontSize.base[0],
    },
  },
}

// ==================== STATUS TAGS ====================
export const statusTag = {
  'В наличии': {
    bg: colors.success[100],
    text: colors.success[700],
    type: 'success' as const,
  },
  'Зарезервирован': {
    bg: colors.warning[100],
    text: colors.warning[700],
    type: 'warning' as const,
  },
  'Продан': {
    bg: colors.error[100],
    text: colors.error[700],
    type: 'error' as const,
  },
  'Удален': {
    bg: colors.neutral[100],
    text: colors.neutral[600],
    type: 'default' as const,
  },
  'Необработан': {
    bg: colors.info[100],
    text: colors.info[700],
    type: 'info' as const,
  },
}

// ==================== DETAIL VIEW ====================
export const detailView = {
  // Layout
  gridGap: spacing[4],           // 16px между элементами
  sectionGap: spacing[6],         // 24px между секциями

  // Label-Value pairs
  labelValueGap: spacing[2],      // 8px между label и value

  // Labels (uppercase)
  label: {
    fontSize: typography.fontSize.xs[0],
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase' as const,
    letterSpacing: typography.letterSpacing.wider,
    color: colors.neutral[500],
  },

  // Values
  value: {
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[900],
  },

  // Field containers
  fieldContainer: {
    padding: `${spacing[2]} ${spacing[3]}`,
    borderRadius: layout.borderRadius.xl,
    backgroundColor: colors.neutral[50],
  },
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Получить цвет статуса
 */
export function getStatusColor(status: string) {
  return statusTag[status as keyof typeof statusTag] || {
    bg: colors.neutral[100],
    text: colors.neutral[600],
    type: 'default' as const,
  }
}

/**
 * Получить Naive UI тип для статуса
 */
export function getStatusType(status: string): 'success' | 'warning' | 'info' | 'error' | 'default' {
  return getStatusColor(status).type
}

// ==================== EXPORT DEFAULT ====================
export default {
  colors,
  spacing,
  typography,
  layout,
  dataTable,
  card,
  button,
  statusTag,
  detailView,
  getStatusColor,
  getStatusType,
}
