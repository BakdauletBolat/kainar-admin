# 🎨 UX/UI ДИЗАЙН СИСТЕМА
## Kainar Admin Panel

**Дата создания:** 2025-12-16
**Версия:** 1.0
**Статус:** В разработке

---

## 📋 ОГЛАВЛЕНИЕ

1. [Общая концепция](#общая-концепция)
2. [Анализ текущего состояния](#анализ-текущего-состояния)
3. [Целевая аудитория](#целевая-аудитория)
4. [Дизайн-система](#дизайн-система)
5. [Компоненты](#компоненты)
6. [Паттерны взаимодействия](#паттерны-взаимодействия)
7. [Страницы и макеты](#страницы-и-макеты)
8. [Адаптивность](#адаптивность)
9. [Accessibility](#accessibility)
10. [План улучшений](#план-улучшений)

---

## 🎯 ОБЩАЯ КОНЦЕПЦИЯ

### Видение

**Kainar Admin Panel** - современная, интуитивная система управления складом автозапчастей, которая делает сложные операции простыми и быстрыми.

### Ключевые принципы

#### 1. Скорость и эффективность
> "Меньше кликов - больше работы"

- Быстрый доступ к частым операциям
- Горячие клавиши для опытных пользователей
- Массовые операции для экономии времени
- Умные фильтры с запоминанием настроек

#### 2. Ясность и понятность
> "Интерфейс говорит сам за себя"

- Понятные названия и иконки
- Контекстные подсказки
- Визуальная иерархия информации
- Четкая обратная связь на действия

#### 3. Надежность и безопасность
> "Предотвращаем ошибки до их появления"

- Подтверждение опасных действий
- Валидация данных в реальном времени
- Автосохранение черновиков
- Отмена критичных операций (undo)

#### 4. Гибкость и адаптивность
> "Работает везде и всегда"

- Responsive дизайн (desktop, tablet, mobile)
- Темная/светлая тема
- Настраиваемые виджеты
- Персонализация интерфейса

---

## 📊 АНАЛИЗ ТЕКУЩЕГО СОСТОЯНИЯ

### ✅ Что работает хорошо

1. **Использование Naive UI**
   - Современный вид компонентов
   - Хорошая документация
   - Rich функционал (таблицы, формы, модалы)

2. **Tailwind CSS**
   - Быстрая стилизация
   - Консистентность отступов
   - Utility-first подход

3. **Базовая структура**
   - Sidebar навигация
   - Breadcrumbs
   - Пагинация

### ❌ Проблемы и болевые точки

#### UX проблемы

1. **Перегруженные страницы**
   ```
   Проблема: Страница списка запчастей содержит слишком много информации
   Решение: Разделить на tabs, скрыть вторичную информацию
   ```

2. **Неочевидные действия**
   ```
   Проблема: Кнопки действий не всегда видны
   Решение: Sticky action bar, контекстное меню
   ```

3. **Долгие формы**
   ```
   Проблема: Форма создания запчасти - много полей на одном экране
   Решение: Multi-step wizard, умное автозаполнение
   ```

4. **Отсутствие обратной связи**
   ```
   Проблема: Непонятно, сохранились ли изменения
   Решение: Toast уведомления, loading states, success indicators
   ```

5. **Слабая фильтрация**
   ```
   Проблема: Фильтры в отдельной модалке, не видно активных фильтров
   Решение: Inline filters, filter chips, saved filters
   ```

#### UI проблемы

1. **Несогласованные отступы**
   ```css
   /* Плохо */
   .component-1 { padding: 16px }
   .component-2 { padding: 20px }

   /* Хорошо - использовать Tailwind spacing scale */
   .component { @apply p-4 } /* 16px */
   ```

2. **Непоследовательная типографика**
   ```
   Проблема: Разные размеры шрифтов для заголовков
   Решение: Единая типографическая шкала
   ```

3. **Отсутствие состояний**
   ```
   Проблема: Кнопки не имеют disabled, loading, success состояний
   Решение: Полный набор состояний для всех интерактивных элементов
   ```

4. **Слабая визуальная иерархия**
   ```
   Проблема: Первичные и вторичные кнопки выглядят одинаково
   Решение: Четкая система приоритетов (primary, secondary, ghost)
   ```

---

## 👥 ЦЕЛЕВАЯ АУДИТОРИЯ

### Персоны

#### 1. Менеджер склада (Основной пользователь)

**Имя:** Асан, 35 лет
**Опыт работы:** 5 лет в складской логистике
**Технические навыки:** Средние

**Цели:**
- Быстро добавлять новые запчасти
- Отслеживать остатки на складах
- Обрабатывать заказы клиентов

**Боли:**
- Много рутинных операций
- Нужно переключаться между разными разделами
- Сложно найти нужную запчасть среди тысяч

**Как мы помогаем:**
- Быстрые действия (quick actions)
- Умный поиск с автодополнением
- Bulk операции для массовых изменений
- Дашборд с ключевыми метриками

#### 2. Директор (Администратор)

**Имя:** Нурлан, 45 лет
**Опыт работы:** 15 лет в бизнесе
**Технические навыки:** Базовые

**Цели:**
- Контроль над всеми операциями
- Аналитика продаж и остатков
- Управление пользователями и правами

**Боли:**
- Нужны отчеты и аналитика
- Долго искать нужную информацию
- Риск ошибок сотрудников

**Как мы помогаем:**
- Dashboard с ключевыми показателями
- Права доступа по ролям
- Аудит-лог действий пользователей
- Экспорт отчетов

#### 3. Продавец (Вторичный пользователь)

**Имя:** Айгуль, 28 лет
**Опыт работы:** 2 года в продажах
**Технические навыки:** Базовые

**Цели:**
- Быстро оформить заказ клиента
- Проверить наличие товара
- Узнать цену и характеристики

**Боли:**
- Клиент ждет на линии
- Сложно найти нужную запчасть
- Непонятные технические характеристики

**Как мы помогаем:**
- Мгновенный поиск по коду/VIN
- Быстрое создание заказа (1 экран)
- Понятные карточки товаров с фото
- История заказов клиента

---

## 🎨 ДИЗАЙН-СИСТЕМА

### Цветовая палитра

#### Primary Colors (Основные)

```css
/* Brand Color - Синий (доверие, профессионализм) */
--primary-50:  #eff6ff;   /* Фон hover */
--primary-100: #dbeafe;   /* Фон selected */
--primary-200: #bfdbfe;   /* Borders */
--primary-300: #93c5fd;   /* Disabled */
--primary-400: #60a5fa;   /* Hover */
--primary-500: #3b82f6;   /* Default - Основной бренд */
--primary-600: #2563eb;   /* Active */
--primary-700: #1d4ed8;   /* Pressed */
--primary-800: #1e40af;   /* Dark theme */
--primary-900: #1e3a8a;   /* Darkest */

/* Success - Зеленый */
--success-500: #10b981;   /* Успешные операции */
--success-600: #059669;   /* Hover */

/* Warning - Желтый */
--warning-500: #f59e0b;   /* Предупреждения */
--warning-600: #d97706;   /* Hover */

/* Error - Красный */
--error-500: #ef4444;     /* Ошибки, удаление */
--error-600: #dc2626;     /* Hover */

/* Info - Голубой */
--info-500: #06b6d4;      /* Информационные сообщения */
--info-600: #0891b2;      /* Hover */
```

#### Neutral Colors (Нейтральные)

```css
/* Grayscale */
--gray-50:  #f9fafb;   /* Фон страницы */
--gray-100: #f3f4f6;   /* Фон карточек */
--gray-200: #e5e7eb;   /* Borders, dividers */
--gray-300: #d1d5db;   /* Disabled elements */
--gray-400: #9ca3af;   /* Placeholder text */
--gray-500: #6b7280;   /* Secondary text */
--gray-600: #4b5563;   /* Body text */
--gray-700: #374151;   /* Headings */
--gray-800: #1f2937;   /* Dark headings */
--gray-900: #111827;   /* Darkest text */
```

#### Semantic Colors (Семантические)

```css
/* Status Colors */
--status-available: #10b981;   /* В наличии */
--status-reserved:  #f59e0b;   /* Зарезервировано */
--status-sold:      #6b7280;   /* Продано */
--status-deleted:   #ef4444;   /* Удалено */
--status-processing: #3b82f6;  /* В обработке */
```

### Использование цветов

```vue
<template>
  <!-- Primary Actions -->
  <button class="bg-primary-500 hover:bg-primary-600">
    Создать запчасть
  </button>

  <!-- Secondary Actions -->
  <button class="bg-gray-100 hover:bg-gray-200 text-gray-700">
    Отмена
  </button>

  <!-- Destructive Actions -->
  <button class="bg-error-500 hover:bg-error-600 text-white">
    Удалить
  </button>

  <!-- Status Badge -->
  <span class="bg-success-100 text-success-700">
    В наличии
  </span>
</template>
```

---

### Типографика

#### Font Family

```css
/* Основной шрифт - системный */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
             'Helvetica Neue', sans-serif;

/* Моноширинный (для кодов, номеров) */
font-family: 'SF Mono', Monaco, 'Courier New', monospace;
```

#### Type Scale

```css
/* Заголовки */
.text-h1 {
  font-size: 2.25rem;    /* 36px */
  line-height: 2.5rem;   /* 40px */
  font-weight: 700;
  letter-spacing: -0.02em;
}

.text-h2 {
  font-size: 1.875rem;   /* 30px */
  line-height: 2.25rem;  /* 36px */
  font-weight: 700;
  letter-spacing: -0.01em;
}

.text-h3 {
  font-size: 1.5rem;     /* 24px */
  line-height: 2rem;     /* 32px */
  font-weight: 600;
}

.text-h4 {
  font-size: 1.25rem;    /* 20px */
  line-height: 1.75rem;  /* 28px */
  font-weight: 600;
}

.text-h5 {
  font-size: 1.125rem;   /* 18px */
  line-height: 1.75rem;  /* 28px */
  font-weight: 600;
}

/* Body текст */
.text-body-lg {
  font-size: 1.125rem;   /* 18px */
  line-height: 1.75rem;  /* 28px */
}

.text-body {
  font-size: 1rem;       /* 16px */
  line-height: 1.5rem;   /* 24px */
}

.text-body-sm {
  font-size: 0.875rem;   /* 14px */
  line-height: 1.25rem;  /* 20px */
}

.text-caption {
  font-size: 0.75rem;    /* 12px */
  line-height: 1rem;     /* 16px */
  color: var(--gray-500);
}
```

#### Использование

```vue
<template>
  <div class="page">
    <!-- Page Title -->
    <h1 class="text-h2 text-gray-900 mb-6">
      Управление запчастями
    </h1>

    <!-- Section Title -->
    <h2 class="text-h4 text-gray-800 mb-4">
      Фильтры
    </h2>

    <!-- Body Text -->
    <p class="text-body text-gray-600">
      Найдено 1,245 запчастей
    </p>

    <!-- Caption -->
    <span class="text-caption">
      Последнее обновление: 16.12.2025
    </span>
  </div>
</template>
```

---

### Spacing System

Используем Tailwind spacing scale (base = 4px):

```css
/* Spacing Scale */
spacing-0:   0px      /* none */
spacing-1:   4px      /* 0.25rem */
spacing-2:   8px      /* 0.5rem */
spacing-3:   12px     /* 0.75rem */
spacing-4:   16px     /* 1rem */
spacing-5:   20px     /* 1.25rem */
spacing-6:   24px     /* 1.5rem */
spacing-8:   32px     /* 2rem */
spacing-10:  40px     /* 2.5rem */
spacing-12:  48px     /* 3rem */
spacing-16:  64px     /* 4rem */
spacing-20:  80px     /* 5rem */
spacing-24:  96px     /* 6rem */
```

#### Применение

```vue
<template>
  <!-- Card spacing -->
  <div class="p-6 space-y-4">
    <!-- Title -->
    <h3 class="mb-4">Заголовок</h3>

    <!-- Form fields -->
    <div class="space-y-3">
      <input />
      <input />
    </div>

    <!-- Actions -->
    <div class="flex gap-3 mt-6">
      <button>Сохранить</button>
      <button>Отмена</button>
    </div>
  </div>
</template>
```

**Правила отступов:**

| Контекст | Spacing | Значение |
|----------|---------|----------|
| Внутри компонента | p-4, p-6 | 16px, 24px |
| Между секциями | space-y-6, space-y-8 | 24px, 32px |
| Между элементами | space-y-3, space-y-4 | 12px, 16px |
| Кнопки gap | gap-3 | 12px |
| Page padding | px-6, py-8 | 24px, 32px |

---

### Border Radius

```css
/* Border Radius Scale */
.rounded-none  { border-radius: 0px; }
.rounded-sm    { border-radius: 2px; }    /* Inputs, small buttons */
.rounded       { border-radius: 4px; }    /* Default */
.rounded-md    { border-radius: 6px; }    /* Cards, buttons */
.rounded-lg    { border-radius: 8px; }    /* Large cards */
.rounded-xl    { border-radius: 12px; }   /* Modals */
.rounded-2xl   { border-radius: 16px; }   /* Large modals */
.rounded-full  { border-radius: 9999px; } /* Pills, avatars */
```

**Применение:**
- Inputs: `rounded-md` (6px)
- Buttons: `rounded-md` (6px)
- Cards: `rounded-lg` (8px)
- Modals: `rounded-xl` (12px)
- Avatars: `rounded-full`
- Badges: `rounded-full`

---

### Shadows

```css
/* Shadow Scale */
.shadow-sm    /* Subtle - cards hover */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

.shadow       /* Default - cards */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
              0 1px 2px 0 rgba(0, 0, 0, 0.06);

.shadow-md    /* Medium - dropdowns */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);

.shadow-lg    /* Large - modals */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);

.shadow-xl    /* Extra large - popovers */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

### Icons

**Библиотека:** Heroicons v2

```typescript
// Размеры иконок
icon-sm:  16px (w-4 h-4)   // В тексте
icon-md:  20px (w-5 h-5)   // В кнопках
icon-lg:  24px (w-6 h-6)   // В заголовках
icon-xl:  32px (w-8 h-8)   // Feature icons
```

**Использование:**

```vue
<script setup>
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline'
</script>

<template>
  <!-- Button with icon -->
  <button class="flex items-center gap-2">
    <PlusIcon class="w-5 h-5" />
    <span>Создать</span>
  </button>

  <!-- Icon button -->
  <button class="p-2">
    <PencilIcon class="w-5 h-5" />
  </button>
</template>
```

---

## 🧩 КОМПОНЕНТЫ

### Кнопки (Buttons)

#### Варианты

```vue
<script setup lang="ts">
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: Component
  iconPosition?: 'left' | 'right'
}
</script>

<template>
  <!-- Primary Button -->
  <button class="btn btn-primary">
    Создать запчасть
  </button>

  <!-- Secondary Button -->
  <button class="btn btn-secondary">
    Отмена
  </button>

  <!-- Ghost Button -->
  <button class="btn btn-ghost">
    Редактировать
  </button>

  <!-- Danger Button -->
  <button class="btn btn-danger">
    Удалить
  </button>

  <!-- Button with icon -->
  <button class="btn btn-primary">
    <PlusIcon class="w-5 h-5" />
    <span>Создать</span>
  </button>

  <!-- Icon only button -->
  <button class="btn-icon">
    <PencilIcon class="w-5 h-5" />
  </button>

  <!-- Loading state -->
  <button class="btn btn-primary" disabled>
    <SpinnerIcon class="w-5 h-5 animate-spin" />
    <span>Загрузка...</span>
  </button>
</template>

<style scoped>
/* Base button styles */
.btn {
  @apply inline-flex items-center justify-center gap-2
         px-4 py-2 rounded-md font-medium
         transition-colors duration-200
         focus:outline-none focus:ring-2 focus:ring-offset-2
         disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Variants */
.btn-primary {
  @apply bg-primary-500 text-white
         hover:bg-primary-600
         focus:ring-primary-500;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700
         hover:bg-gray-200
         focus:ring-gray-500;
}

.btn-ghost {
  @apply bg-transparent text-gray-700
         hover:bg-gray-100
         focus:ring-gray-500;
}

.btn-danger {
  @apply bg-error-500 text-white
         hover:bg-error-600
         focus:ring-error-500;
}

/* Icon only */
.btn-icon {
  @apply p-2 rounded-md text-gray-600
         hover:bg-gray-100
         focus:outline-none focus:ring-2;
}

/* Sizes */
.btn-sm {
  @apply px-3 py-1.5 text-sm;
}

.btn-lg {
  @apply px-6 py-3 text-lg;
}
</style>
```

---

### Inputs (Поля ввода)

```vue
<script setup lang="ts">
interface InputProps {
  modelValue: string | number
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  icon?: Component
  iconPosition?: 'left' | 'right'
}
</script>

<template>
  <div class="input-group">
    <!-- Label -->
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="text-error-500">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="input-wrapper">
      <!-- Left icon -->
      <component
        v-if="icon && iconPosition === 'left'"
        :is="icon"
        class="input-icon input-icon-left"
      />

      <!-- Input -->
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'input',
          { 'input-error': error },
          { 'input-with-icon-left': icon && iconPosition === 'left' },
          { 'input-with-icon-right': icon && iconPosition === 'right' }
        ]"
      />

      <!-- Right icon -->
      <component
        v-if="icon && iconPosition === 'right'"
        :is="icon"
        class="input-icon input-icon-right"
      />
    </div>

    <!-- Hint or Error -->
    <p v-if="error" class="input-error-text">
      {{ error }}
    </p>
    <p v-else-if="hint" class="input-hint">
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
.input-group {
  @apply space-y-1.5;
}

.input-label {
  @apply block text-sm font-medium text-gray-700;
}

.input-wrapper {
  @apply relative;
}

.input {
  @apply w-full px-3 py-2
         border border-gray-300 rounded-md
         text-gray-900 placeholder-gray-400
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
         disabled:bg-gray-100 disabled:cursor-not-allowed
         transition-colors duration-200;
}

.input-error {
  @apply border-error-500 focus:ring-error-500;
}

.input-with-icon-left {
  @apply pl-10;
}

.input-with-icon-right {
  @apply pr-10;
}

.input-icon {
  @apply absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400;
}

.input-icon-left {
  @apply left-3;
}

.input-icon-right {
  @apply right-3;
}

.input-error-text {
  @apply text-sm text-error-500;
}

.input-hint {
  @apply text-sm text-gray-500;
}
</style>
```

**Использование:**

```vue
<template>
  <Input
    v-model="form.name"
    label="Название запчасти"
    placeholder="Введите название"
    required
    :error="errors.name"
  />

  <Input
    v-model="form.search"
    placeholder="Поиск..."
    :icon="MagnifyingGlassIcon"
    icon-position="left"
  />
</template>
```

---

### Cards (Карточки)

```vue
<template>
  <!-- Basic Card -->
  <div class="card">
    <h3 class="card-title">Заголовок</h3>
    <p class="card-content">Контент карточки</p>
  </div>

  <!-- Card with header and footer -->
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Запчасть #12345</h3>
      <button class="btn-icon">
        <EllipsisHorizontalIcon class="w-5 h-5" />
      </button>
    </div>

    <div class="card-content">
      <p>Тормозные колодки передние</p>
      <div class="mt-4 flex items-center justify-between">
        <span class="text-sm text-gray-500">Склад: Алматы</span>
        <span class="badge badge-success">В наличии</span>
      </div>
    </div>

    <div class="card-footer">
      <button class="btn btn-primary">Редактировать</button>
      <button class="btn btn-ghost">Удалить</button>
    </div>
  </div>

  <!-- Clickable Card -->
  <button class="card card-interactive">
    <img src="part-image.jpg" class="card-image" />
    <div class="card-content">
      <h4 class="font-semibold">Название запчасти</h4>
      <p class="text-sm text-gray-500">25,000 ₸</p>
    </div>
  </button>
</template>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow p-6;
}

.card-interactive {
  @apply hover:shadow-md transition-shadow cursor-pointer
         focus:outline-none focus:ring-2 focus:ring-primary-500;
}

.card-header {
  @apply flex items-center justify-between mb-4 pb-4 border-b;
}

.card-title {
  @apply text-lg font-semibold text-gray-900;
}

.card-content {
  @apply text-gray-600;
}

.card-footer {
  @apply flex items-center gap-3 mt-6 pt-6 border-t;
}

.card-image {
  @apply w-full h-48 object-cover rounded-t-lg;
}
</style>
```

---

### Badges (Бейджи)

```vue
<template>
  <!-- Status badges -->
  <span class="badge badge-success">В наличии</span>
  <span class="badge badge-warning">Зарезервировано</span>
  <span class="badge badge-error">Продано</span>
  <span class="badge badge-neutral">Удалено</span>
  <span class="badge badge-info">В обработке</span>

  <!-- Badge with icon -->
  <span class="badge badge-success">
    <CheckCircleIcon class="w-4 h-4" />
    <span>Подтверждено</span>
  </span>

  <!-- Badge with dot -->
  <span class="badge badge-warning">
    <span class="badge-dot"></span>
    <span>Ожидает</span>
  </span>
</template>

<style scoped>
.badge {
  @apply inline-flex items-center gap-1.5
         px-2.5 py-0.5 rounded-full
         text-xs font-medium;
}

.badge-success {
  @apply bg-success-100 text-success-700;
}

.badge-warning {
  @apply bg-warning-100 text-warning-700;
}

.badge-error {
  @apply bg-error-100 text-error-700;
}

.badge-info {
  @apply bg-info-100 text-info-700;
}

.badge-neutral {
  @apply bg-gray-100 text-gray-700;
}

.badge-dot {
  @apply w-2 h-2 rounded-full bg-current;
}
</style>
```

---

### Tables (Таблицы)

**Требования к таблице:**
- Сортировка колонок
- Фильтрация
- Пагинация
- Выбор строк (checkbox)
- Sticky header
- Responsive (horizontal scroll на мобильных)
- Loading состояние
- Empty state

```vue
<template>
  <div class="table-container">
    <!-- Table Actions -->
    <div class="table-actions">
      <div class="flex items-center gap-3">
        <Input
          v-model="search"
          placeholder="Поиск..."
          :icon="MagnifyingGlassIcon"
          icon-position="left"
        />
        <button class="btn btn-secondary">
          <FunnelIcon class="w-5 h-5" />
          Фильтры
        </button>
      </div>

      <div class="flex items-center gap-3">
        <button v-if="selectedRows.length" class="btn btn-danger">
          <TrashIcon class="w-5 h-5" />
          Удалить ({{ selectedRows.length }})
        </button>
        <button class="btn btn-primary">
          <PlusIcon class="w-5 h-5" />
          Создать
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <n-data-table
        :columns="columns"
        :data="data"
        :loading="loading"
        :row-key="row => row.id"
        @update:checked-row-keys="handleSelectionChange"
      />
    </div>

    <!-- Pagination -->
    <div class="table-pagination">
      <span class="text-sm text-gray-600">
        Показано {{ pageStart }}-{{ pageEnd }} из {{ total }}
      </span>
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:current-page="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.table-container {
  @apply bg-white rounded-lg shadow;
}

.table-actions {
  @apply flex items-center justify-between p-4 border-b;
}

.table-wrapper {
  @apply overflow-x-auto;
}

.table-pagination {
  @apply flex items-center justify-between p-4 border-t;
}
</style>
```

---

### Modals (Модальные окна)

```vue
<script setup lang="ts">
interface ModalProps {
  show: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="handleClose">
        <div
          :class="['modal-container', `modal-${size}`]"
          @click.stop
        >
          <!-- Header -->
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button
              v-if="closable"
              class="btn-icon"
              @click="handleClose"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 z-50
         bg-black/50 backdrop-blur-sm
         flex items-center justify-center
         p-4;
}

.modal-container {
  @apply bg-white rounded-xl shadow-xl
         max-h-[90vh] overflow-hidden
         flex flex-col;
}

.modal-sm  { @apply max-w-sm; }
.modal-md  { @apply max-w-md; }
.modal-lg  { @apply max-w-2xl; }
.modal-xl  { @apply max-w-4xl; }
.modal-full { @apply max-w-7xl w-full; }

.modal-header {
  @apply flex items-center justify-between
         px-6 py-4 border-b;
}

.modal-title {
  @apply text-lg font-semibold text-gray-900;
}

.modal-content {
  @apply px-6 py-4 overflow-y-auto;
}

.modal-footer {
  @apply flex items-center justify-end gap-3
         px-6 py-4 border-t bg-gray-50;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  @apply transition-all duration-300;
}

.modal-enter-from,
.modal-leave-to {
  @apply opacity-0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  @apply scale-95;
}
</style>
```

---

## 🎭 ПАТТЕРНЫ ВЗАИМОДЕЙСТВИЯ

### Loading States

```vue
<template>
  <!-- Button loading -->
  <button class="btn btn-primary" :disabled="loading">
    <SpinnerIcon v-if="loading" class="w-5 h-5 animate-spin" />
    <span>{{ loading ? 'Загрузка...' : 'Сохранить' }}</span>
  </button>

  <!-- Page loading -->
  <div v-if="loading" class="loading-page">
    <SpinnerIcon class="w-8 h-8 animate-spin text-primary-500" />
    <p class="mt-4 text-gray-600">Загрузка данных...</p>
  </div>

  <!-- Skeleton loading -->
  <div v-if="loading" class="space-y-4">
    <div class="skeleton h-8 w-3/4"></div>
    <div class="skeleton h-4 w-full"></div>
    <div class="skeleton h-4 w-5/6"></div>
  </div>

  <!-- Table loading -->
  <n-data-table
    :data="data"
    :loading="loading"
    loading-text="Загрузка данных..."
  />
</template>

<style scoped>
.loading-page {
  @apply flex flex-col items-center justify-center
         min-h-[400px];
}

.skeleton {
  @apply bg-gray-200 rounded animate-pulse;
}
</style>
```

---

### Empty States

```vue
<template>
  <!-- No data -->
  <div class="empty-state">
    <DocumentIcon class="empty-state-icon" />
    <h3 class="empty-state-title">Нет данных</h3>
    <p class="empty-state-description">
      Здесь пока ничего нет. Создайте первую запчасть.
    </p>
    <button class="btn btn-primary mt-4">
      <PlusIcon class="w-5 h-5" />
      Создать запчасть
    </button>
  </div>

  <!-- No search results -->
  <div class="empty-state">
    <MagnifyingGlassIcon class="empty-state-icon" />
    <h3 class="empty-state-title">Ничего не найдено</h3>
    <p class="empty-state-description">
      По запросу "{{ search }}" ничего не найдено.
      Попробуйте изменить параметры поиска.
    </p>
    <button class="btn btn-secondary mt-4" @click="clearSearch">
      Очистить поиск
    </button>
  </div>

  <!-- Error state -->
  <div class="empty-state">
    <ExclamationTriangleIcon class="empty-state-icon text-error-500" />
    <h3 class="empty-state-title">Ошибка загрузки</h3>
    <p class="empty-state-description">
      Не удалось загрузить данные. Попробуйте еще раз.
    </p>
    <button class="btn btn-primary mt-4" @click="retry">
      Повторить
    </button>
  </div>
</template>

<style scoped>
.empty-state {
  @apply flex flex-col items-center justify-center
         py-12 px-4 text-center;
}

.empty-state-icon {
  @apply w-16 h-16 text-gray-400 mb-4;
}

.empty-state-title {
  @apply text-lg font-semibold text-gray-900 mb-2;
}

.empty-state-description {
  @apply text-gray-600 max-w-md;
}
</style>
```

---

### Notifications (Уведомления)

```typescript
// composables/use-notification.ts
import { useNotification as useNaiveNotification } from 'naive-ui'

export function useNotification() {
  const notification = useNaiveNotification()

  return {
    success(message: string, description?: string) {
      notification.success({
        title: message,
        content: description,
        duration: 3000
      })
    },

    error(message: string, description?: string) {
      notification.error({
        title: message,
        content: description,
        duration: 5000
      })
    },

    warning(message: string, description?: string) {
      notification.warning({
        title: message,
        content: description,
        duration: 4000
      })
    },

    info(message: string, description?: string) {
      notification.info({
        title: message,
        content: description,
        duration: 3000
      })
    }
  }
}
```

**Использование:**

```vue
<script setup>
import { useNotification } from '@shared/lib/hooks/use-notification'

const notification = useNotification()

async function savePart() {
  try {
    await partApi.create(form.value)
    notification.success('Запчасть создана', 'Данные успешно сохранены')
  } catch (error) {
    notification.error('Ошибка', 'Не удалось сохранить данные')
  }
}
</script>
```

---

### Form Validation

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string().required('Название обязательно'),
  price: yup.number()
    .required('Цена обязательна')
    .min(0, 'Цена должна быть положительной'),
  warehouse: yup.number().required('Выберите склад')
})

const { errors, values, handleSubmit, defineField } = useForm({
  validationSchema: schema
})

const [name, nameAttrs] = defineField('name')
const [price, priceAttrs] = defineField('price')
const [warehouse, warehouseAttrs] = defineField('warehouse')

const onSubmit = handleSubmit(async (values) => {
  await partApi.create(values)
  notification.success('Запчасть создана')
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <Input
      v-model="name"
      v-bind="nameAttrs"
      label="Название"
      :error="errors.name"
      required
    />

    <Input
      v-model="price"
      v-bind="priceAttrs"
      type="number"
      label="Цена"
      :error="errors.price"
      required
    />

    <Select
      v-model="warehouse"
      v-bind="warehouseAttrs"
      label="Склад"
      :options="warehouseOptions"
      :error="errors.warehouse"
      required
    />

    <div class="flex justify-end gap-3">
      <button type="button" class="btn btn-secondary">
        Отмена
      </button>
      <button type="submit" class="btn btn-primary">
        Сохранить
      </button>
    </div>
  </form>
</template>
```

---

### Confirmation Dialogs

```vue
<script setup lang="ts">
import { useDialog } from 'naive-ui'

const dialog = useDialog()

function confirmDelete(partId: number) {
  dialog.warning({
    title: 'Подтверждение удаления',
    content: 'Вы уверены, что хотите удалить эту запчасть? Это действие нельзя отменить.',
    positiveText: 'Удалить',
    negativeText: 'Отмена',
    onPositiveClick: async () => {
      await partApi.delete(partId)
      notification.success('Запчасть удалена')
      await loadParts()
    }
  })
}
</script>

<template>
  <button class="btn btn-danger" @click="confirmDelete(part.id)">
    <TrashIcon class="w-5 h-5" />
    Удалить
  </button>
</template>
```

---

## 📄 СТРАНИЦЫ И МАКЕТЫ

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  TopHeader (64px)                                   │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │  Main Content Area                       │
│ (256px)  │                                          │
│          │  ┌────────────────────────────────────┐  │
│          │  │  Page Header                       │  │
│          │  │  - Breadcrumbs                     │  │
│          │  │  - Title                           │  │
│          │  │  - Actions                         │  │
│          │  └────────────────────────────────────┘  │
│          │                                          │
│          │  ┌────────────────────────────────────┐  │
│          │  │  Page Content                      │  │
│          │  │  - Filters/Search                  │  │
│          │  │  - Data Table/Grid                 │  │
│          │  │  - Pagination                      │  │
│          │  └────────────────────────────────────┘  │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### Main Layout

```vue
<!-- layouts/MainLayout.vue -->
<template>
  <div class="layout">
    <!-- Header -->
    <header class="layout-header">
      <TopHeader />
    </header>

    <!-- Sidebar -->
    <aside class="layout-sidebar">
      <Sidebar />
    </aside>

    <!-- Main -->
    <main class="layout-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  @apply min-h-screen bg-gray-50;
}

.layout-header {
  @apply fixed top-0 left-0 right-0 z-40
         h-16 bg-white border-b shadow-sm;
}

.layout-sidebar {
  @apply fixed top-16 left-0 bottom-0 z-30
         w-64 bg-white border-r
         overflow-y-auto;
}

.layout-main {
  @apply ml-64 mt-16 p-6
         min-h-[calc(100vh-4rem)];
}

/* Mobile */
@media (max-width: 768px) {
  .layout-sidebar {
    @apply -translate-x-full transition-transform;
  }

  .layout-sidebar.open {
    @apply translate-x-0;
  }

  .layout-main {
    @apply ml-0;
  }
}
</style>
```

---

### List Page (Страница списка)

```vue
<!-- pages/parts/list/ui/PartsListPage.vue -->
<template>
  <div class="page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <Breadcrumbs :items="breadcrumbs" />
        <h1 class="page-title">Запчасти</h1>
        <p class="page-description">
          Управление складом автозапчастей
        </p>
      </div>

      <div class="page-actions">
        <button class="btn btn-secondary">
          <ArrowDownTrayIcon class="w-5 h-5" />
          Экспорт
        </button>
        <button class="btn btn-primary" @click="openCreateModal">
          <PlusIcon class="w-5 h-5" />
          Создать запчасть
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="page-filters">
      <div class="flex items-center gap-3 flex-1">
        <Input
          v-model="filters.search"
          placeholder="Поиск по названию, коду..."
          :icon="MagnifyingGlassIcon"
          icon-position="left"
          class="max-w-md"
        />

        <button class="btn btn-secondary" @click="showFilters = true">
          <FunnelIcon class="w-5 h-5" />
          Фильтры
          <span v-if="activeFiltersCount" class="badge badge-primary">
            {{ activeFiltersCount }}
          </span>
        </button>
      </div>

      <!-- Active Filters -->
      <div v-if="activeFilters.length" class="filter-chips">
        <span
          v-for="filter in activeFilters"
          :key="filter.key"
          class="filter-chip"
        >
          {{ filter.label }}: {{ filter.value }}
          <button @click="removeFilter(filter.key)">
            <XMarkIcon class="w-4 h-4" />
          </button>
        </span>
        <button class="text-sm text-primary-600" @click="clearFilters">
          Очистить все
        </button>
      </div>
    </div>

    <!-- Content -->
    <PartsTable />
  </div>
</template>

<style scoped>
.page {
  @apply space-y-6;
}

.page-header {
  @apply flex items-start justify-between;
}

.page-title {
  @apply text-2xl font-bold text-gray-900 mt-2;
}

.page-description {
  @apply text-gray-600 mt-1;
}

.page-actions {
  @apply flex items-center gap-3;
}

.page-filters {
  @apply bg-white rounded-lg shadow p-4 space-y-3;
}

.filter-chips {
  @apply flex items-center flex-wrap gap-2;
}

.filter-chip {
  @apply inline-flex items-center gap-1
         px-3 py-1 bg-primary-100 text-primary-700
         rounded-full text-sm;
}
</style>
```

---

### Detail Page (Страница детали)

```vue
<!-- pages/parts/detail/ui/PartDetailPage.vue -->
<template>
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <Breadcrumbs :items="breadcrumbs" />
        <div class="flex items-center gap-4 mt-2">
          <h1 class="page-title">{{ part?.name }}</h1>
          <StatusBadge :status="part?.status" />
        </div>
      </div>

      <div class="page-actions">
        <button class="btn btn-ghost">
          <ShareIcon class="w-5 h-5" />
        </button>
        <button class="btn btn-secondary" @click="editPart">
          <PencilIcon class="w-5 h-5" />
          Редактировать
        </button>
        <button class="btn btn-danger" @click="deletePart">
          <TrashIcon class="w-5 h-5" />
          Удалить
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-3 gap-6">
      <!-- Main Info (2 columns) -->
      <div class="col-span-2 space-y-6">
        <!-- Images -->
        <div class="card">
          <h3 class="card-title mb-4">Фотографии</h3>
          <ImageGallery :images="part?.pictures" />
        </div>

        <!-- Details -->
        <div class="card">
          <h3 class="card-title mb-4">Характеристики</h3>
          <dl class="detail-list">
            <div class="detail-item">
              <dt>Категория</dt>
              <dd>{{ part?.category.name }}</dd>
            </div>
            <div class="detail-item">
              <dt>Производитель</dt>
              <dd>{{ part?.modelCar.manufacturer.name }}</dd>
            </div>
            <div class="detail-item">
              <dt>Модель автомобиля</dt>
              <dd>{{ part?.modelCar.name }}</dd>
            </div>
            <!-- ... остальные поля -->
          </dl>
        </div>

        <!-- History -->
        <div class="card">
          <h3 class="card-title mb-4">История изменений</h3>
          <Timeline :events="history" />
        </div>
      </div>

      <!-- Sidebar (1 column) -->
      <div class="space-y-6">
        <!-- Price -->
        <div class="card">
          <h3 class="card-title mb-4">Цена</h3>
          <div class="space-y-2">
            <div>
              <span class="text-sm text-gray-500">Цена продажи</span>
              <p class="text-2xl font-bold text-gray-900">
                {{ formatCurrency(part?.price) }}
              </p>
            </div>
            <div>
              <span class="text-sm text-gray-500">Рыночная цена</span>
              <p class="text-lg text-gray-600">
                {{ formatCurrency(part?.marketPrice) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Warehouse -->
        <div class="card">
          <h3 class="card-title mb-4">Склад</h3>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <BuildingStorefrontIcon class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p class="font-medium">{{ part?.warehouse.name }}</p>
              <p class="text-sm text-gray-500">{{ part?.warehouse.city.name }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <h3 class="card-title mb-4">Действия</h3>
          <div class="space-y-2">
            <button class="btn btn-secondary w-full justify-start">
              <DocumentDuplicateIcon class="w-5 h-5" />
              Дублировать
            </button>
            <button class="btn btn-secondary w-full justify-start">
              <ArrowPathIcon class="w-5 h-5" />
              Переместить на склад
            </button>
            <button class="btn btn-secondary w-full justify-start">
              <PrinterIcon class="w-5 h-5" />
              Печать QR кода
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-list {
  @apply divide-y;
}

.detail-item {
  @apply py-3 flex items-start justify-between;
}

.detail-item dt {
  @apply text-sm text-gray-500 flex-shrink-0 w-40;
}

.detail-item dd {
  @apply text-sm text-gray-900 font-medium;
}
</style>
```

---

### Form Page (Страница формы)

```vue
<!-- pages/parts/create/ui/PartCreatePage.vue -->
<template>
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <Breadcrumbs :items="breadcrumbs" />
        <h1 class="page-title">Создание запчасти</h1>
      </div>
    </div>

    <!-- Progress Steps (если multi-step form) -->
    <div class="card mb-6">
      <Steps :current="currentStep" :steps="steps" />
    </div>

    <!-- Form -->
    <form @submit="onSubmit" class="space-y-6">
      <!-- Basic Info -->
      <div class="card">
        <h3 class="card-title mb-4">Основная информация</h3>
        <div class="grid grid-cols-2 gap-4">
          <Input
            v-model="form.name"
            label="Название"
            placeholder="Тормозные колодки передние"
            :error="errors.name"
            required
          />

          <Select
            v-model="form.category"
            label="Категория"
            :options="categoryOptions"
            :error="errors.category"
            required
          />

          <!-- ... остальные поля -->
        </div>
      </div>

      <!-- Pricing -->
      <div class="card">
        <h3 class="card-title mb-4">Цены</h3>
        <div class="grid grid-cols-2 gap-4">
          <Input
            v-model="form.price"
            type="number"
            label="Цена продажи"
            :error="errors.price"
            required
          />

          <Input
            v-model="form.marketPrice"
            type="number"
            label="Рыночная цена"
            hint="Для справки"
          />
        </div>
      </div>

      <!-- Images -->
      <div class="card">
        <h3 class="card-title mb-4">Фотографии</h3>
        <ImageUpload
          v-model="form.images"
          :max-files="10"
          accept="image/*"
        />
      </div>

      <!-- Actions -->
      <div class="sticky bottom-0 bg-white border-t shadow-lg p-4 flex justify-between">
        <button type="button" class="btn btn-secondary" @click="cancel">
          Отмена
        </button>

        <div class="flex gap-3">
          <button
            type="button"
            class="btn btn-secondary"
            @click="saveDraft"
          >
            Сохранить черновик
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <SpinnerIcon v-if="loading" class="w-5 h-5 animate-spin" />
            <span>{{ loading ? 'Сохранение...' : 'Создать запчасть' }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
```

---

## 📱 АДАПТИВНОСТЬ

### Breakpoints

```css
/* Tailwind breakpoints */
sm:  640px   /* Small devices (phones) */
md:  768px   /* Medium devices (tablets) */
lg:  1024px  /* Large devices (laptops) */
xl:  1280px  /* Extra large (desktops) */
2xl: 1536px  /* 2X Extra large (large desktops) */
```

### Responsive Patterns

#### 1. Sidebar Navigation

```vue
<template>
  <!-- Desktop: Fixed sidebar -->
  <aside class="hidden md:block fixed left-0 w-64">
    <Sidebar />
  </aside>

  <!-- Mobile: Drawer -->
  <Drawer v-model:show="showMenu" placement="left">
    <Sidebar />
  </Drawer>

  <!-- Mobile: Bottom navigation -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0">
    <BottomNav />
  </nav>
</template>
```

#### 2. Tables

```vue
<template>
  <!-- Desktop: Full table -->
  <div class="hidden md:block">
    <n-data-table :data="data" :columns="columns" />
  </div>

  <!-- Mobile: Card list -->
  <div class="md:hidden space-y-3">
    <div v-for="item in data" :key="item.id" class="card">
      <h4 class="font-semibold">{{ item.name }}</h4>
      <p class="text-sm text-gray-500">{{ item.category }}</p>
      <div class="flex justify-between items-center mt-3">
        <span class="font-bold">{{ formatCurrency(item.price) }}</span>
        <StatusBadge :status="item.status" />
      </div>
    </div>
  </div>
</template>
```

#### 3. Grid Layouts

```vue
<template>
  <!-- Responsive grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <Card v-for="item in items" :key="item.id" />
  </div>

  <!-- Stack on mobile -->
  <div class="flex flex-col md:flex-row gap-4">
    <div class="flex-1">Main content</div>
    <aside class="md:w-64">Sidebar</aside>
  </div>
</template>
```

---

## ♿ ACCESSIBILITY

### Принципы

1. **Keyboard Navigation**
   - Все интерактивные элементы доступны с клавиатуры
   - Видимый focus indicator
   - Логичный tab order

2. **Screen Readers**
   - Семантичный HTML
   - ARIA атрибуты где нужно
   - Alt text для изображений

3. **Color Contrast**
   - Минимум 4.5:1 для обычного текста
   - Минимум 3:1 для крупного текста
   - Не полагаться только на цвет

4. **Forms**
   - Labels для всех inputs
   - Error messages связаны с полями
   - Required индикация

### Примеры

```vue
<template>
  <!-- Button with accessible label -->
  <button
    class="btn-icon"
    aria-label="Редактировать запчасть"
    title="Редактировать"
  >
    <PencilIcon class="w-5 h-5" />
  </button>

  <!-- Input with proper labels -->
  <div>
    <label for="part-name" class="input-label">
      Название запчасти
      <span class="text-error-500" aria-label="обязательное поле">*</span>
    </label>
    <input
      id="part-name"
      v-model="form.name"
      :aria-invalid="!!errors.name"
      :aria-describedby="errors.name ? 'part-name-error' : undefined"
    />
    <span v-if="errors.name" id="part-name-error" class="input-error-text" role="alert">
      {{ errors.name }}
    </span>
  </div>

  <!-- Modal with focus trap -->
  <Modal
    :show="showModal"
    :aria-labelledby="modalTitleId"
    role="dialog"
    aria-modal="true"
  >
    <h2 :id="modalTitleId">Modal Title</h2>
    <!-- content -->
  </Modal>

  <!-- Loading state announcement -->
  <div v-if="loading" role="status" aria-live="polite">
    <span class="sr-only">Загрузка данных...</span>
    <SpinnerIcon class="animate-spin" aria-hidden="true" />
  </div>
</template>

<style>
/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus visible */
*:focus-visible {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2;
}
</style>
```

---

## 🚀 ПЛАН УЛУЧШЕНИЙ

### Фаза 1: Базовые улучшения (1-2 недели)

**Приоритет: Высокий**

- [ ] Унифицировать типографику (использовать text-h*, text-body*)
- [ ] Стандартизировать отступы (spacing scale)
- [ ] Добавить loading states во все формы и таблицы
- [ ] Добавить empty states
- [ ] Улучшить error handling и показ ошибок
- [ ] Добавить toast notifications
- [ ] Создать компонент StatusBadge с правильными цветами

### Фаза 2: Компоненты (2-3 недели)

**Приоритет: Высокий**

- [ ] Создать библиотеку переиспользуемых компонентов в `shared/ui/`
- [ ] Переписать все кнопки на единый Button компонент
- [ ] Создать Input компонент с валидацией
- [ ] Создать Select компонент
- [ ] Создать Modal компонент
- [ ] Создать Card компонент
- [ ] Документировать все компоненты (Storybook?)

### Фаза 3: UX улучшения (2-3 недели)

**Приоритет: Средний**

- [ ] Добавить breadcrumbs на все страницы
- [ ] Улучшить фильтры (inline, saved filters)
- [ ] Добавить bulk операции
- [ ] Добавить quick actions menu (контекстное меню)
- [ ] Улучшить поиск (автодополнение, подсветка)
- [ ] Добавить keyboard shortcuts
- [ ] Добавить автосохранение черновиков в формах
- [ ] Реализовать multi-step формы для создания запчасти

### Фаза 4: Адаптивность (1-2 недели)

**Приоритет: Средний**

- [ ] Адаптировать таблицы под мобильные (card view)
- [ ] Создать mobile drawer для фильтров
- [ ] Добавить bottom navigation для мобильных
- [ ] Оптимизировать формы для touch устройств
- [ ] Тестирование на разных устройствах

### Фаза 5: Продвинутые фичи (3-4 недели)

**Приоритет: Низкий**

- [ ] Темная тема
- [ ] Персонализация (сохранение настроек пользователя)
- [ ] Dashboard с виджетами
- [ ] Аналитика и отчеты
- [ ] Экспорт данных (Excel, PDF)
- [ ] Печать документов
- [ ] Offline режим (PWA)

### Фаза 6: Accessibility (1 неделя)

**Приоритет: Средний**

- [ ] Audit всех компонентов на accessibility
- [ ] Добавить ARIA атрибуты
- [ ] Проверить keyboard navigation
- [ ] Проверить color contrast
- [ ] Тестирование со screen readers

---

## 📚 РЕСУРСЫ

### Дизайн системы reference

- [Tailwind UI](https://tailwindui.com/) - примеры компонентов
- [Shadcn UI](https://ui.shadcn.com/) - компоненты на Tailwind
- [Naive UI](https://www.naiveui.com/) - текущая UI библиотека
- [Headless UI](https://headlessui.com/) - accessible компоненты

### Цвета и палитры

- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)
- [Color Hunt](https://colorhunt.co/)
- [Coolors](https://coolors.co/)

### Иконки

- [Heroicons](https://heroicons.com/)
- [Lucide Icons](https://lucide.dev/)
- [Ionicons](https://ionic.io/ionicons)

### Инструменты

- [Figma](https://figma.com/) - дизайн макетов
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - проверка контраста
- [axe DevTools](https://www.deque.com/axe/devtools/) - accessibility testing

---

## ✅ ЧЕКЛИСТ ВНЕДРЕНИЯ

### Перед стартом

- [ ] Ознакомиться с дизайн-системой
- [ ] Изучить текущие компоненты Naive UI
- [ ] Определить приоритеты улучшений
- [ ] Создать Figma макеты (опционально)

### Во время разработки

- [ ] Использовать дизайн-токены (цвета, spacing)
- [ ] Следовать типографической шкале
- [ ] Добавлять все состояния (loading, error, empty, success)
- [ ] Тестировать на разных размерах экрана
- [ ] Проверять accessibility

### После разработки

- [ ] Code review на соответствие дизайн-системе
- [ ] Тестирование UX
- [ ] Документирование компонентов
- [ ] Обновление этого документа

---

**Последнее обновление:** 2025-12-16
**Автор:** Claude Code
**Статус:** В разработке

---

**Let's build beautiful interfaces! 🎨**
