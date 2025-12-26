# Kainar Admin Design System

Дизайн-система основана на **IBM Carbon Design System**, адаптированная под ваш стиль.

## 📁 Структура

```
src/styles/
  ├── design-tokens.ts    # Основной файл с токенами
  └── DESIGN_SYSTEM.md    # Эта документация
```

## 🎨 Design Tokens

### 1. Цвета (Colors)

```typescript
import { colors } from '@/styles/design-tokens'

// Neutral (основной серый)
colors.neutral[50]   // #f8fafc - очень светлый фон
colors.neutral[100]  // #f1f5f9 - светлый фон
colors.neutral[500]  // #64748b - серый текст
colors.neutral[900]  // #0f172a - темный текст

// Primary (желтый accent)
colors.primary[500]  // #eab308 - основной желтый

// Semantic
colors.success[500]  // Зеленый (для "В наличии")
colors.warning[500]  // Оранжевый (для "Зарезервирован")
colors.error[500]    // Красный (для "Продан")
```

### 2. Spacing (Отступы)

Базовая единица: **8px**

```typescript
import { spacing } from '@/styles/design-tokens'

spacing[2]  // 8px  - базовая единица
spacing[4]  // 16px - стандартный gap
spacing[6]  // 24px - padding в карточках
spacing[8]  // 32px - большие отступы
```

### 3. Typography (Типографика)

```typescript
import { typography } from '@/styles/design-tokens'

// Размеры шрифтов
typography.fontSize.xs    // 12px - мелкий текст
typography.fontSize.sm    // 14px - основной для данных
typography.fontSize.base  // 16px - стандартный
typography.fontSize.xl    // 20px - подзаголовки
typography.fontSize['2xl'] // 24px - заголовки секций

// Веса
typography.fontWeight.normal    // 400
typography.fontWeight.medium    // 500
typography.fontWeight.semibold  // 600
typography.fontWeight.bold      // 700
```

## 📊 Специальные токены для таблиц

```typescript
import { dataTable } from '@/styles/design-tokens'

// Высота строк (рекомендуется default)
dataTable.rowHeight.compact      // 32px
dataTable.rowHeight.default      // 48px ⭐
dataTable.rowHeight.comfortable  // 56px

// Стили
dataTable.styles.headerBg        // Фон заголовка
dataTable.styles.rowHoverBg      // Hover на строках
dataTable.styles.borderColor     // Цвет границ
```

## 🃏 Карточки

```typescript
import { card } from '@/styles/design-tokens'

card.padding.md        // 24px - стандартный padding
card.borderRadius      // 32px - скругление
card.borderColor       // Цвет границы
```

## 🏷️ Статусы

```typescript
import { getStatusType, getStatusColor } from '@/styles/design-tokens'

// Получить тип для Naive UI
const type = getStatusType('В наличии') // 'success'

// Получить цвета статуса
const statusColors = getStatusColor('В наличии')
// { bg: '#dcfce7', text: '#15803d', type: 'success' }
```

## 🎯 Примеры использования

### Пример 1: Breadcrumbs для навигации

```vue
<template>
  <n-breadcrumb class="mb-2">
    <n-breadcrumb-item>
      <router-link to="/" class="text-slate-600 hover:text-slate-900 transition-colors">
        Главная
      </router-link>
    </n-breadcrumb-item>
    <n-breadcrumb-item>
      <router-link to="/parts" class="text-slate-600 hover:text-slate-900 transition-colors">
        Запчасти
      </router-link>
    </n-breadcrumb-item>
    <n-breadcrumb-item>
      <span class="text-slate-900 font-medium">Детали</span>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>
```

### Пример 2: Таблица с правильными стилями

```vue
<script setup lang="ts">
import { getStatusType } from '@/styles/design-tokens'

const columns = [
  {
    title: 'Название',
    key: 'name',
    width: 420,
    render(row) {
      return h('div', {
        class: 'text-sm font-semibold text-slate-900 leading-tight'
      }, row.name)
    }
  },
  {
    title: 'Статус',
    key: 'status',
    align: 'center',
    render(row) {
      return h(NTag, {
        type: getStatusType(row.status),
        round: true,
        bordered: false,
        class: 'px-3 py-1 text-xs font-semibold'
      }, { default: () => row.status })
    }
  }
]
</script>
```

### Пример 3: Карточка с информацией

```vue
<template>
  <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
    <h2 class="text-2xl font-semibold text-slate-900 mb-2">
      Заголовок
    </h2>
    <p class="text-sm text-slate-600">
      Подзаголовок или описание
    </p>
  </div>
</template>
```

### Пример 4: Label-Value пары (детальный просмотр)

```vue
<template>
  <div class="space-y-2">
    <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
      Склад
    </p>
    <p class="rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900">
      {{ warehouse.name }}
    </p>
  </div>
</template>
```

### Пример 5: Кнопка действия

```vue
<template>
  <n-button
    type="primary"
    round
    size="large"
    class="font-medium"
  >
    Создать
  </n-button>
</template>
```

## 📄 Паттерны страниц

### INDEX страницы (Списки)

#### Структура страницы списка

```vue
<template>
  <section class="space-y-4 pb-10">
    <!-- 1. Breadcrumbs -->
    <n-breadcrumb class="mb-2">
      <n-breadcrumb-item>
        <router-link to="/" class="text-slate-600 hover:text-slate-900 transition-colors">
          Главная
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <span class="text-slate-900 font-medium">Запчасти</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <!-- 2. Header Card -->
    <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
      <n-page-header class="px-0">
        <template #title>
          <span class="text-2xl font-semibold text-slate-900">Запчасти</span>
        </template>
        <template #subtitle>
          <span class="text-sm text-slate-600">Управление складом и карточками запчастей</span>
        </template>
        <template #extra>
          <n-button type="primary" round size="large" class="font-medium">
            Создать
          </n-button>
        </template>
      </n-page-header>
    </div>

    <main class="space-y-3">
      <!-- 3. Фильтры (опционально) -->
      <div class="rounded-3xl bg-white px-5 py-4 shadow-none border border-slate-200/70">
        <parts-filter />
      </div>

      <section class="space-y-3">
        <!-- 4. Статистика и действия -->
        <div class="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 border border-slate-200/80 shadow-sm">
          <div class="space-y-1.5">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Всего</p>
            <p class="text-2xl font-bold text-slate-900">{{ count.toLocaleString('ru-RU') }}</p>
            <p v-if="selected" class="text-sm font-medium text-slate-600">Выбрано {{ selected }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <!-- Кнопки действий -->
          </div>
        </div>

        <!-- 5. Таблица -->
        <div class="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
          <n-data-table
            remote
            size="large"
            :striped="false"
            :bordered="false"
          />
        </div>
      </section>
    </main>
  </section>
</template>
```

#### Паттерны ячеек таблицы

**1. Ячейка с изображением и текстом:**
```vue
render(row) {
  return h(RouterLink, {
    class: "flex gap-3 items-center py-1.5",
    to: { name: 'detail', params: { id: row.id } }
  }, {
    default: () => [
      // Изображение 48x48
      h('div', {
        class: 'overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200/60',
        style: { width: '48px', height: '48px', minWidth: '48px', minHeight: '48px' }
      }, [/* img */]),

      // Текстовый контент
      h('div', { class: 'flex flex-col gap-1.5 min-w-0 py-0.5' }, [
        // Заголовок
        h('div', { class: 'text-sm font-semibold text-slate-900 leading-tight' }, row.name),

        // Подзаголовок
        h('div', { class: 'text-xs text-slate-600 truncate leading-tight' }, row.subtitle),

        // Badges
        h('div', { class: 'flex flex-wrap gap-1.5 text-xs text-slate-500 mt-0.5' }, [
          h('span', { class: 'inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-medium' }, `ID ${row.id}`)
        ])
      ])
    ]
  })
}
```

**2. Ячейка со статусом:**
```vue
{
  title: "Статус",
  key: "status",
  width: 150,
  align: 'center',
  render(row) {
    return h('div', { class: 'flex justify-center' }, [
      h(NTag, {
        round: true,
        type: getStatusType(row.status),
        bordered: false,
        class: 'px-3 py-1 text-xs font-semibold'
      }, { default: () => row.status })
    ])
  }
}
```

**3. Ячейка с ценой:**
```vue
{
  title: "Цена",
  key: "price",
  width: 130,
  align: 'right',
  render(row) {
    return h('div', { class: 'flex justify-end' }, [
      h('span', {
        class: 'inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white'
      }, formatPrice(row.price))
    ])
  }
}
```

**4. Ячейка с датой:**
```vue
{
  title: "Дата создание",
  key: "created_at",
  width: 150,
  sorter: true,
  render(row) {
    return h('div', { class: 'text-sm text-slate-600 font-medium' }, formatDate(row.created_at))
  }
}
```

**5. Ячейка с комментарием:**
```vue
{
  title: "Комментарий",
  key: "comment",
  width: 240,
  ellipsis: { tooltip: true },
  render(row) {
    return h('div', {
      class: 'text-sm text-slate-500 max-w-[320px] line-clamp-2 leading-relaxed'
    }, row.comment || '—')
  }
}
```

#### Пагинация

```typescript
const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  itemCount: 0,
  pageSizes: [10, 25, 50, 100],
  showQuickJumper: true,
  prefix({ itemCount }: any) {
    return `${itemCount.toLocaleString('ru-RU')} записей`
  },
  onChange: (page: number) => {
    // Handle page change
  },
  onUpdatePageSize: (pageSize: number) => {
    // Handle page size change
  }
})
```

### DETAIL страницы (Детальный просмотр)

#### Структура страницы детального просмотра

```vue
<template>
  <main class="space-y-5">
    <!-- 1. Breadcrumbs -->
    <n-breadcrumb class="mb-2 print:hidden">
      <n-breadcrumb-item>
        <router-link to="/" class="text-slate-600 hover:text-slate-900 transition-colors">
          Главная
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <router-link to="/list" class="text-slate-600 hover:text-slate-900 transition-colors">
          Запчасти
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <span class="text-slate-900 font-medium">{{ item.name }}</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <!-- 2. Header Card -->
    <div class="print:hidden">
      <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <!-- Левая часть: информация -->
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-3">
              <p class="text-2xl font-semibold text-slate-900">
                {{ item.name }}
              </p>
              <n-tag round :type="getStatusType(item.status)" :bordered="false">
                {{ item.status }}
              </n-tag>
              <span class="text-xs font-semibold text-slate-500">ID {{ item.id }}</span>
            </div>

            <div class="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                Склад: {{ item.warehouse }}
              </span>
              <span class="text-slate-500">Создано {{ formatDate(item.created_at) }}</span>
            </div>

            <div class="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-900">
              <span>Цена:</span>
              <span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-base font-semibold">
                {{ formatPrice(item.price) }}
              </span>
            </div>
          </div>

          <!-- Правая часть: кнопки действий -->
          <div class="flex flex-wrap items-center gap-2">
            <n-button quaternary round @click="handleBack">Назад</n-button>
            <n-button secondary round @click="handleEdit">Редактировать</n-button>
            <n-button type="primary" round @click="handlePrint">Печать</n-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Loading state -->
    <div v-if="isLoading" class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <n-skeleton height="420px" width="100%" :sharp="false" />
      <n-skeleton height="420px" width="100%" :sharp="false" />
      <n-skeleton height="420px" width="100%" :sharp="false" />
    </div>

    <!-- 4. Контент: Grid Layout (3fr + 2fr) -->
    <div v-else class="grid w-full gap-4 print:hidden md:grid-cols-[3fr_2fr]">
      <!-- Левая колонка (основной контент) -->
      <div class="space-y-4">
        <n-card size="large">
          <!-- Основной контент (изображения, описание и т.д.) -->
        </n-card>
      </div>

      <!-- Правая колонка (дополнительная информация) -->
      <div class="space-y-4">
        <n-card size="large">
          <h3 class="mb-3 text-lg font-semibold text-slate-900">Технические характеристики</h3>
          <div class="grid gap-3 sm:grid-cols-2">
            <!-- Label-Value pairs -->
          </div>
        </n-card>

        <n-card size="large">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900">Параметры</h3>
            <span class="text-xs uppercase tracking-[0.08em] text-slate-500">Рабочие поля</span>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <!-- Label-Value pairs -->
          </div>
        </n-card>
      </div>
    </div>
  </main>
</template>
```

#### Label-Value паттерн (основной для detail)

**Вариант 1: Простое поле**
```vue
<div class="space-y-2">
  <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
    Склад / город
  </p>
  <p class="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
    {{ warehouse.name }} <span class="text-slate-500"> · {{ warehouse.city }}</span>
  </p>
</div>
```

**Вариант 2: Поле со статусом**
```vue
<div class="space-y-2">
  <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
    Статус
  </p>
  <n-tag :type="getStatusType(status)" round :bordered="false">
    {{ status }}
  </n-tag>
</div>
```

**Вариант 3: Поле с массивом значений (badges)**
```vue
<div class="space-y-2">
  <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
    ОЕМ коды
  </p>
  <div class="flex flex-wrap gap-2">
    <span
      v-for="code in codes"
      :key="code"
      class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
    >
      {{ code }}
    </span>
    <span v-if="!codes.length" class="text-sm text-slate-500">—</span>
  </div>
</div>
```

**Вариант 4: Широкое поле (span 2 columns)**
```vue
<div class="space-y-2 sm:col-span-2">
  <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
    Комментарий
  </p>
  <p class="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700 min-h-[56px]">
    {{ comment || '—' }}
  </p>
</div>
```

**Вариант 5: Мини-карточки в grid**
```vue
<div class="grid gap-3 sm:grid-cols-2">
  <div
    v-for="item in items"
    :key="item.key"
    class="rounded-2xl bg-slate-50 px-3 py-2"
  >
    <p class="text-xs uppercase tracking-[0.08em] text-slate-500">{{ item.key }}</p>
    <p class="text-sm font-semibold text-slate-900">{{ item.value }}</p>
  </div>
</div>
```

### Общие паттерны

#### Empty State
```vue
const renderTableEmpty = () =>
  h('div', {
    class: 'flex flex-col items-center justify-center py-10 text-center text-slate-500'
  }, [
    h(NIcon, { component: ArchiveOutline, size: 32, class: 'mb-2 text-slate-400' }),
    h('p', { class: 'text-sm font-semibold text-slate-700' }, 'Нет данных'),
    h('p', { class: 'text-xs text-slate-500' }, 'Измените фильтры или сбросьте поиск')
  ])
```

#### Loading State
```vue
<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
  <n-skeleton height="420px" width="100%" :sharp="false" />
  <n-skeleton height="420px" width="100%" :sharp="false" />
  <n-skeleton height="420px" width="100%" :sharp="false" />
</div>
```

#### Badges (теги, метки)
```vue
<!-- Маленький badge -->
<span class="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium">
  ID {{ id }}
</span>

<!-- Badge с цветом -->
<span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700 font-medium">
  {{ warehouse }}
</span>

<!-- Большой badge (для цены и т.д.) -->
<span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">
  {{ price }}
</span>

<!-- Темный badge (акцент) -->
<span class="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white">
  {{ price }}
</span>
```

## 📐 Основные принципы

### 1. Spacing (8px grid)
- Используйте кратные 8px отступы: 8, 16, 24, 32, 48
- Между элементами: `gap-4` (16px)
- Padding в карточках: `px-6 py-5` (24px/20px)
- Между секциями: `space-y-4` (16px)

### 2. Typography
```css
/* Заголовки */
.page-title { @apply text-2xl font-semibold text-slate-900; }
.section-title { @apply text-lg font-semibold text-slate-900; }

/* Основной текст */
.body-text { @apply text-sm text-slate-600; }
.label { @apply text-xs font-semibold uppercase tracking-wider text-slate-500; }

/* Data (в таблицах) */
.data-text { @apply text-sm font-medium text-slate-900; }
```

### 3. Границы и тени
```css
/* Карточки */
.card {
  @apply rounded-3xl border border-slate-200/80 bg-white shadow-sm;
}

/* Таблицы */
.table-container {
  @apply rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-sm;
}
```

### 4. Цвета текста
- Основной текст: `text-slate-900`
- Вторичный текст: `text-slate-600`
- Второстепенный текст: `text-slate-500`
- Disabled: `text-slate-400`

### 5. Hover эффекты
```css
/* Строки таблицы */
.table-row {
  @apply hover:bg-slate-50 transition-colors duration-150;
}

/* Кнопки */
.button {
  @apply transition-all duration-200;
}
```

## 📱 Responsive Design

```vue
<template>
  <!-- Mobile first -->
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <!-- Контент -->
  </div>
</template>
```

## ✅ Чеклист применения дизайн-системы

- [ ] Импортировать нужные токены из `@/styles/design-tokens`
- [ ] Использовать `spacing` для отступов (кратно 8px)
- [ ] Применять правильные размеры шрифтов из `typography`
- [ ] Использовать `colors.neutral` для текста и фонов
- [ ] Применять `getStatusType()` для статусов
- [ ] Высота строк таблицы: 48px (default)
- [ ] Padding в ячейках: 16px горизонтальный
- [ ] Border radius карточек: `rounded-3xl` (32px)
- [ ] Тени: `shadow-sm` или `shadow-none`
- [ ] Границы: `border-slate-200/80`

## 🔄 Миграция существующих компонентов

1. Найдите компонент с таблицей/карточкой
2. Замените hardcoded значения на токены
3. Проверьте consistency с design-tokens.ts
4. Протестируйте на разных разрешениях

## 📚 Дополнительные ресурсы

- [IBM Carbon Design System](https://carbondesignsystem.com)
- [Naive UI Documentation](https://naiveui.com)
- [Tailwind CSS](https://tailwindcss.com)
