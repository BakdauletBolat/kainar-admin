# 🚀 ПОЛНЫЙ ПЛАН МИГРАЦИИ НА FSD АРХИТЕКТУРУ
## Проект: Kainar Admin

**Дата создания:** 2025-12-16
**Статус:** В процессе
**Текущая фаза:** Фаза 4 завершена ✅ → Готовы к Фазе 5

---

## 📋 ОГЛАВЛЕНИЕ

1. [Общая информация](#общая-информация)
2. [Текущее состояние проекта](#текущее-состояние-проекта)
3. [Целевая архитектура](#целевая-архитектура)
4. [Фазы миграции](#фазы-миграции)
5. [Детальный план по фазам](#детальный-план-по-фазам)
6. [Чеклисты и прогресс](#чеклисты-и-прогресс)
7. [Риски и проблемы](#риски-и-проблемы)
8. [FAQ](#faq)

---

## 🎯 ОБЩАЯ ИНФОРМАЦИЯ

### Зачем миграция на FSD?

**Текущие проблемы:**
- ❌ Смешанные паттерны (Options API + Composition API)
- ❌ Дублирование кода и типов
- ❌ API логика в stores (нарушение SRP)
- ❌ Монолитные компоненты (200+ строк)
- ❌ Прямые зависимости компонентов от stores
- ❌ Отсутствие переиспользуемых features
- ❌ Сложное тестирование и поддержка

**Преимущества FSD:**
- ✅ Четкое разделение ответственности
- ✅ Переиспользуемость кода
- ✅ Простота тестирования
- ✅ Масштабируемость
- ✅ Изолированность модулей
- ✅ Унифицированная структура
- ✅ Легкий онбординг новых разработчиков

### Технологический стек

- **Vue 3.4.19** (Script Setup)
- **TypeScript 5.2.2**
- **Pinia 2.2.2**
- **Vue Router 4.3.0**
- **Axios 1.6.7**
- **Naive UI 2.39.0**
- **Tailwind CSS 3.4.1**
- **Vite 7.3.0**

---

## 📊 ТЕКУЩЕЕ СОСТОЯНИЕ ПРОЕКТА

### Структура проекта (до миграции)

```
src/
├── apis/                    # API слой (7 файлов)
│   ├── index.ts             # Axios instance
│   ├── interfaces.ts        # Общие типы
│   ├── products.ts          # API запчастей
│   ├── orders.ts            # API заказов
│   ├── repo.ts              # API авто
│   └── domain/              # Domain модели
├── stores/                  # State management (13 stores)
│   ├── auth-store.ts        # Аутентификация
│   ├── product-store.ts     # Запчасти
│   ├── order-store.ts       # Заказы
│   ├── warehouses-store.ts  # Склады
│   └── ...                  # Остальные stores
├── components/              # Компоненты (~30 файлов)
│   ├── Sidebar.vue
│   ├── Table.vue
│   ├── Parts/               # Компоненты запчастей
│   ├── Orders/              # Компоненты заказов
│   └── ...
├── views/                   # Страницы
│   ├── parts/               # Страницы запчастей
│   ├── orders/              # Страницы заказов
│   ├── warehouses/          # Страницы складов
│   └── ...
├── routers/                 # Роутинг
└── utils/                   # Утилиты
```

### Что уже мигрировано (Фаза 1)

```
src/
├── shared/                  # ✅ Базовая инфраструктура
│   ├── api/
│   │   ├── base/           # ✅ http-client, api-config, api-types
│   │   ├── interceptors/   # ✅ auth, error
│   │   └── lib/            # ✅ query-builder
│   └── lib/
│       ├── formatters/     # ✅ currency, date
│       ├── utils/          # ✅ array-utils
│       └── hooks/          # ✅ use-pagination, use-table-selection
├── entities/
│   └── user/               # ✅ Полностью мигрирован
│       ├── index.ts
│       ├── model/          # ✅ user-types, user-store
│       └── api/            # ✅ user-api
```

### Статистика

- **Всего stores:** 13
- **Мигрировано stores:** 1 (user)
- **Осталось stores:** 12
- **Всего API файлов:** 7
- **Всего компонентов:** ~30
- **Всего страниц:** ~20
- **Прогресс миграции:** ~15%

---

## 🎨 ЦЕЛЕВАЯ АРХИТЕКТУРА

### FSD структура (после миграции)

```
src/
├── app/                        # Инициализация приложения
│   ├── providers/              # Провайдеры (router, pinia)
│   ├── styles/                 # Глобальные стили
│   └── index.ts                # Entry point
│
├── pages/                      # Страницы (роуты)
│   ├── parts/
│   │   ├── list/               # /parts/list
│   │   ├── create/             # /parts/create
│   │   ├── edit/               # /parts/:id/edit
│   │   └── detail/             # /parts/:id
│   ├── orders/
│   ├── warehouses/
│   └── ...
│
├── widgets/                    # Сложные составные блоки
│   ├── header/                 # TopHeader, Sidebar
│   ├── parts-table/            # Таблица запчастей
│   ├── orders-table/           # Таблица заказов
│   └── ...
│
├── features/                   # Бизнес-функции
│   ├── auth/
│   │   ├── login/              # Форма логина
│   │   └── logout/             # Логика выхода
│   ├── parts/
│   │   ├── create-part/        # Создание запчасти
│   │   ├── edit-part/          # Редактирование
│   │   ├── filter-parts/       # Фильтрация
│   │   └── delete-parts/       # Удаление
│   ├── orders/
│   │   ├── create-order/       # Создание заказа
│   │   ├── confirm-order/      # Подтверждение
│   │   └── cancel-order/       # Отмена
│   └── ...
│
├── entities/                   # Бизнес-сущности
│   ├── user/                   # ✅ Готов
│   │   ├── index.ts
│   │   ├── model/              # types, store
│   │   ├── api/                # API функции
│   │   └── ui/                 # UI компоненты (опционально)
│   ├── part/                   # Запчасть
│   ├── order/                  # Заказ
│   ├── warehouse/              # Склад
│   ├── category/               # Категория
│   ├── manufacturer/           # Производитель
│   ├── model-car/              # Модель авто
│   ├── modification/           # Модификация
│   ├── client/                 # Клиент
│   ├── feedback/               # Заявка
│   └── color/                  # Цвет
│
└── shared/                     # ✅ Готов (базовая структура)
    ├── api/                    # API инфраструктура
    ├── ui/                     # Общие UI компоненты
    ├── lib/                    # Утилиты, хуки
    └── config/                 # Конфигурация
```

### Слои FSD (снизу вверх)

1. **shared** - переиспользуемая инфраструктура (API, UI, utils)
2. **entities** - бизнес-сущности (User, Part, Order)
3. **features** - функции пользователя (создать заказ, удалить запчасть)
4. **widgets** - композитные блоки из features + entities
5. **pages** - страницы приложения
6. **app** - инициализация и провайдеры

### Правила импортов

```typescript
// ✅ Разрешено (снизу вверх)
pages → widgets
pages → features
pages → entities
pages → shared

widgets → features
widgets → entities
widgets → shared

features → entities
features → shared

entities → shared

// ❌ Запрещено (сверху вниз, между одноуровневыми)
shared → entities
entities → features
widgets → pages
features → features (другой feature)
entities → entities (другой entity)
```

---

## 🗺️ ФАЗЫ МИГРАЦИИ

### Обзор фаз

| Фаза | Название | Статус | Сложность | Время (оценка) |
|------|----------|--------|-----------|----------------|
| 0 | Подготовка | ✅ Готово | Низкая | - |
| 1 | Shared слой | ✅ Готово | Средняя | - |
| 2 | Entity User | ✅ Готово | Средняя | - |
| 3 | Entity Part | ✅ Готово | Высокая | - |
| 4 | Entities (базовые) | ✅ Готово | Средняя | - |
| 5 | Entities (зависимые) | ⏳ Ожидает | Средняя | - |
| 6 | Features (CRUD) | ⏳ Ожидает | Высокая | - |
| 7 | Features (бизнес) | ⏳ Ожидает | Высокая | - |
| 8 | Widgets | ⏳ Ожидает | Средняя | - |
| 9 | Pages | ⏳ Ожидает | Средняя | - |
| 10 | App layer | ⏳ Ожидает | Низкая | - |
| 11 | Миграция импортов | ⏳ Ожидает | Средняя | - |
| 12 | Удаление старого кода | ⏳ Ожидает | Низкая | - |
| 13 | Тестирование | ⏳ Ожидает | Высокая | - |

---

## 📝 ДЕТАЛЬНЫЙ ПЛАН ПО ФАЗАМ

---

## ФАЗА 0: Подготовка ✅

**Статус:** Завершена
**Зависимости:** Нет

### Задачи

- [x] Создать структуру папок FSD
- [x] Настроить path aliases в tsconfig.json
- [x] Настроить aliases в vite.config.ts
- [x] Создать `.fsd-examples/` с примерами
- [x] Создать README для миграции

### Результат

```json
// tsconfig.json - Path aliases
{
  "compilerOptions": {
    "paths": {
      "@app/*": ["./src/app/*"],
      "@pages/*": ["./src/pages/*"],
      "@widgets/*": ["./src/widgets/*"],
      "@features/*": ["./src/features/*"],
      "@entities/*": ["./src/entities/*"],
      "@shared/*": ["./src/shared/*"]
    }
  }
}
```

---

## ФАЗА 1: Shared слой ✅

**Статус:** Завершена
**Зависимости:** Фаза 0

### Задачи

- [x] Создать `shared/api/base/` (http-client, api-config, api-types)
- [x] Создать `shared/api/interceptors/` (auth, error)
- [x] Создать `shared/api/lib/` (query-builder)
- [x] Создать `shared/lib/formatters/` (currency, date)
- [x] Создать `shared/lib/utils/` (array-utils)
- [x] Создать `shared/lib/hooks/` (use-pagination, use-table-selection)

### Файлы

```
src/shared/
├── api/
│   ├── base/
│   │   ├── api-config.ts          # ✅ Централизованные endpoints
│   │   ├── api-types.ts           # ✅ Общие типы API
│   │   └── http-client.ts         # ✅ Axios instance
│   ├── interceptors/
│   │   ├── auth-interceptor.ts    # ✅ Добавление токенов
│   │   └── error-interceptor.ts   # ✅ Обработка ошибок
│   └── lib/
│       └── query-builder.ts       # ✅ Построение query
└── lib/
    ├── formatters/
    │   ├── currency-formatter.ts  # ✅ Форматирование валюты
    │   └── date-formatter.ts      # ✅ Форматирование дат
    ├── utils/
    │   └── array-utils.ts         # ✅ Работа с массивами
    └── hooks/
        ├── use-pagination.ts      # ✅ Хук пагинации
        └── use-table-selection.ts # ✅ Хук выбора в таблице
```

### Ключевые моменты

- Решена проблема циклических зависимостей в interceptors
- Централизованные endpoints в `ENDPOINTS` объекте
- Composition API для всех утилит

---

## ФАЗА 2: Entity User ✅

**Статус:** Завершена
**Зависимости:** Фаза 1

### Задачи

- [x] Создать `entities/user/model/user-types.ts`
- [x] Создать `entities/user/api/user-api.ts`
- [x] Создать `entities/user/model/user-store.ts`
- [x] Создать `entities/user/index.ts`
- [x] Заменить использование `auth-store.ts` на `entities/user`

### Миграция

**Было (старое):**
```typescript
// src/stores/auth-store.ts
export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null }),
  actions: {
    async authUser(credentials) { ... }
  }
})
```

**Стало (FSD):**
```typescript
// src/entities/user/model/user-store.ts
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  async function login(credentials: LoginCredentials) { ... }

  return { user, login }
})
```

### Результат

- ✅ Полностью рабочий entity User
- ✅ Разделение на API, Store, Types
- ✅ Composition API вместо Options API
- ✅ Публичный API через index.ts

---

## ФАЗА 3: Entity Part ✅

**Статус:** Завершена (100%)
**Зависимости:** Фаза 2

### Задачи

- [x] Создать `entities/part/model/part-types.ts`
- [x] Создать `entities/part/api/part-api.ts`
- [x] Создать `entities/part/model/part-store.ts`
- [x] Создать `entities/part/index.ts`
- [ ] Создать `entities/part/lib/part-mappers.ts` (опционально, позже)
- [ ] Обновить использование в компонентах (будет в следующих фазах)

### Детальный план

#### 3.1. Завершить part-types.ts

**Файл:** `src/entities/part/model/part-types.ts` (уже создан, нужно закоммитить)

```typescript
export interface Part {
  id: number
  name: string
  price: number | null
  marketPrice: number | null
  status: PartStatus
  warehouse: PartWarehouse
  category: PartCategory
  modelCar: ModelCar
  // ... остальные поля
}

export type PartStatus = 'available' | 'sold' | 'reserved' | 'deleted' | 'processing'

export interface PartFilters { ... }
export interface PartListItem { ... }
```

#### 3.2. Создать part-api.ts

**Файл:** `src/entities/part/api/part-api.ts`

**Источник:** Мигрировать из `src/apis/products.ts`

```typescript
import { httpClient } from '@shared/api/base/http-client'
import { ENDPOINTS } from '@shared/api/base/api-config'
import { buildQueryString } from '@shared/api/lib/query-builder'
import type { Part, PartFilters, PartListItem } from '../model/part-types'
import type { ApiListResponse } from '@shared/api/base/api-types'

export const partApi = {
  // Получить список запчастей
  async getList(filters: PartFilters): Promise<ApiListResponse<PartListItem>> {
    const query = buildQueryString(filters)
    const { data } = await httpClient.get(`${ENDPOINTS.PARTS}?${query}`)
    return data
  },

  // Получить одну запчасть
  async getById(id: number): Promise<Part> {
    const { data } = await httpClient.get(`${ENDPOINTS.PARTS}${id}/`)
    return data
  },

  // Создать запчасть
  async create(part: Partial<Part>): Promise<Part> {
    const { data } = await httpClient.post(ENDPOINTS.PARTS, part)
    return data
  },

  // Обновить запчасть
  async update(id: number, part: Partial<Part>): Promise<Part> {
    const { data } = await httpClient.patch(`${ENDPOINTS.PARTS}${id}/`, part)
    return data
  },

  // Удалить запчасти
  async bulkDelete(ids: number[]): Promise<void> {
    await httpClient.post(`${ENDPOINTS.PARTS}bulk-delete/`, { ids })
  },

  // Загрузить изображения
  async uploadImages(id: number, images: File[]): Promise<void> {
    const formData = new FormData()
    images.forEach(img => formData.append('images', img))
    await httpClient.post(`${ENDPOINTS.PARTS}${id}/images/`, formData)
  }
}
```

#### 3.3. Создать part-store.ts

**Файл:** `src/entities/part/model/part-store.ts`

**Источник:** Мигрировать из `src/stores/product-store.ts`

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { partApi } from '../api/part-api'
import type { Part, PartFilters, PartListItem } from './part-types'

export const usePartStore = defineStore('part', () => {
  // State
  const parts = ref<PartListItem[]>([])
  const part = ref<Part | null>(null)
  const totalCount = ref(0)
  const isLoading = ref(false)
  const filters = ref<PartFilters>({})

  // Getters
  const hasFilters = computed(() => Object.keys(filters.value).length > 0)

  // Actions
  async function loadParts(newFilters?: PartFilters) {
    isLoading.value = true
    try {
      if (newFilters) {
        filters.value = { ...filters.value, ...newFilters }
      }
      const response = await partApi.getList(filters.value)
      parts.value = response.results
      totalCount.value = response.count
    } catch (error) {
      console.error('Failed to load parts:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function loadPart(id: number) {
    isLoading.value = true
    try {
      part.value = await partApi.getById(id)
    } catch (error) {
      console.error('Failed to load part:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function createPart(data: Partial<Part>) {
    return await partApi.create(data)
  }

  async function updatePart(id: number, data: Partial<Part>) {
    return await partApi.update(id, data)
  }

  async function bulkDelete(ids: number[]) {
    await partApi.bulkDelete(ids)
    // Обновить список после удаления
    await loadParts()
  }

  function clearFilters() {
    filters.value = {}
  }

  function resetState() {
    parts.value = []
    part.value = null
    totalCount.value = 0
    filters.value = {}
  }

  return {
    // State
    parts,
    part,
    totalCount,
    isLoading,
    filters,
    // Getters
    hasFilters,
    // Actions
    loadParts,
    loadPart,
    createPart,
    updatePart,
    bulkDelete,
    clearFilters,
    resetState
  }
})
```

#### 3.4. Создать part-mappers.ts (опционально)

**Файл:** `src/entities/part/lib/part-mappers.ts`

```typescript
import type { Part, PartListItem } from '../model/part-types'

// Маппер для списка (если API возвращает другую структуру)
export function mapPartListItem(apiPart: any): PartListItem {
  return {
    id: apiPart.id,
    name: apiPart.name,
    price: apiPart.price,
    marketPrice: apiPart.market_price,
    status: apiPart.status,
    warehouse: {
      name: apiPart.warehouse.name,
      city: { name: apiPart.warehouse.city.name }
    },
    category: { name: apiPart.category.name },
    modelCar: { name: apiPart.model_car.name },
    pictures: apiPart.pictures,
    createdAt: new Date(apiPart.created_at),
    updatedAt: new Date(apiPart.updated_at)
  }
}

// Маппер для детальной запчасти
export function mapPart(apiPart: any): Part {
  return {
    // ... детальный маппинг
  }
}
```

#### 3.5. Создать index.ts

**Файл:** `src/entities/part/index.ts`

```typescript
// Public API модуля Part
export { usePartStore } from './model/part-store'
export { partApi } from './api/part-api'
export type {
  Part,
  PartStatus,
  PartFilters,
  PartListItem,
  PartWarehouse,
  PartCategory,
  PartPicture,
  PartDetail,
  ModelCar,
  Manufacturer,
  EavAttributes
} from './model/part-types'
```

### Тестирование Фазы 3

После завершения миграции, проверить:

```typescript
// В компоненте
import { usePartStore } from '@entities/part'

const partStore = usePartStore()
await partStore.loadParts({ status: 'available' })
```

### Результат Фазы 3 ✅

- ✅ Полностью рабочий entity Part с Composition API
- ✅ Разделение на API, Store, Types
- ✅ Централизованное использование httpClient и ENDPOINTS
- ✅ Убрана обработка 401 ошибок из store (теперь в interceptor)
- ✅ Добавлены новые методы: createPart, updatePart, clearFilters, setFilter, resetState
- ✅ Публичный API через index.ts
- ✅ Сборка проходит успешно
- ✅ Исправлены TypeScript ошибки в shared/lib/hooks/use-table-selection.ts

**Коммит:** `4cfd5fe` - feat: complete Entity Part migration (Phase 3)

### Что удалить после Фазы 3

- `src/stores/product-store.ts` (после полной миграции)
- `src/apis/products.ts` (после полной миграции)

---

## ФАЗА 4: Entities (базовые) ✅

**Статус:** Завершена (100%)
**Зависимости:** Фаза 3 ✅

**Цель:** Мигрировать простые entities без сложных зависимостей

### Задачи

- [x] Entity: Category
- [x] Entity: Warehouse
- [x] Entity: Color
- [x] Entity: Feedback
- [x] Entity: Client

### 4.1. Entity: Category

**Источник:** `src/stores/category-storage.ts`

**Структура:**
```
src/entities/category/
├── index.ts
├── model/
│   ├── category-types.ts
│   └── category-store.ts
└── api/
    └── category-api.ts
```

**Типы:**
```typescript
// category-types.ts
export interface Category {
  id: number
  name: string
  recarCategoryId: number
  parent: number | null
  createdAt?: string
  updatedAt?: string
}

export interface CategoryTreeOption {
  key: number
  label: string
  children?: CategoryTreeOption[]
}
```

**API:**
```typescript
// category-api.ts
import { httpClient } from '@shared/api/base/http-client'
import { ENDPOINTS } from '@shared/api/base/api-config'

export const categoryApi = {
  async getList(params?: { limit?: number; offset?: number }) {
    const { data } = await httpClient.get(ENDPOINTS.CATEGORIES, { params })
    return data
  },

  async getById(id: number) {
    const { data } = await httpClient.get(`${ENDPOINTS.CATEGORIES}${id}/`)
    return data
  },

  async getTree() {
    const { data } = await httpClient.get(`${ENDPOINTS.CATEGORIES}tree/`)
    return data
  }
}
```

**Store:**
```typescript
// category-store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { categoryApi } from '../api/category-api'
import type { Category, CategoryTreeOption } from './category-types'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const categoryTree = ref<CategoryTreeOption[]>([])
  const isLoading = ref(false)

  const categoryOptions = computed(() =>
    categories.value.map(cat => ({ label: cat.name, value: cat.id }))
  )

  async function loadCategories() {
    isLoading.value = true
    try {
      const response = await categoryApi.getList({ limit: 2000 })
      categories.value = response.results
    } finally {
      isLoading.value = false
    }
  }

  async function loadCategoryTree() {
    const data = await categoryApi.getTree()
    categoryTree.value = data
  }

  return {
    categories,
    categoryTree,
    isLoading,
    categoryOptions,
    loadCategories,
    loadCategoryTree
  }
})
```

### 4.2. Entity: Warehouse

**Источник:** `src/stores/warehouses-store.ts`

**Структура:**
```
src/entities/warehouse/
├── index.ts
├── model/
│   ├── warehouse-types.ts
│   └── warehouse-store.ts
└── api/
    └── warehouse-api.ts
```

**Типы:**
```typescript
// warehouse-types.ts
export interface Warehouse {
  id: number
  name: string
  city: {
    id: number
    name: string
    uid: string | null
    country: number
  }
  categories: number[]
  minStockLevel?: number
}

export interface WarehouseFilters {
  search?: string
  city?: number
  limit?: number
  offset?: number
}
```

**API:**
```typescript
// warehouse-api.ts
export const warehouseApi = {
  async getList(filters: WarehouseFilters) {
    const query = buildQueryString(filters)
    const { data } = await httpClient.get(`${ENDPOINTS.WAREHOUSES}?${query}`)
    return data
  },

  async getById(id: number) {
    const { data } = await httpClient.get(`${ENDPOINTS.WAREHOUSES}${id}/`)
    return data
  },

  async create(warehouse: Partial<Warehouse>) {
    const { data } = await httpClient.post(ENDPOINTS.WAREHOUSES, warehouse)
    return data
  },

  async update(id: number, warehouse: Partial<Warehouse>) {
    const { data } = await httpClient.patch(`${ENDPOINTS.WAREHOUSES}${id}/`, warehouse)
    return data
  },

  async delete(id: number) {
    await httpClient.delete(`${ENDPOINTS.WAREHOUSES}${id}/`)
  }
}
```

### 4.3. Entity: Color

**Источник:** `src/stores/color-store.ts`

**Структура:**
```
src/entities/color/
├── index.ts
├── model/
│   ├── color-types.ts
│   └── color-store.ts
└── api/
    └── color-api.ts
```

### 4.4. Entity: Feedback

**Источник:** `src/stores/feedback-store.ts`

### 4.5. Entity: Client

**Источник:** `src/stores/client-store.ts`

### Чеклист Фазы 4

- [ ] Category: types, api, store, index
- [ ] Warehouse: types, api, store, index
- [ ] Color: types, api, store, index
- [ ] Feedback: types, api, store, index
- [ ] Client: types, api, store, index
- [ ] Тестирование всех entities
- [ ] Коммит: "feat: FSD migration - Phase 4 (Base Entities)"

---

## ФАЗА 5: Entities (зависимые) ⏳

**Статус:** Ожидает завершения Фазы 4
**Зависимости:** Фаза 4

**Цель:** Мигрировать entities с зависимостями от других entities

### Задачи

- [ ] Entity: Manufacturer
- [ ] Entity: ModelCar (зависит от Manufacturer)
- [ ] Entity: Modification (зависит от ModelCar)
- [ ] Entity: Order (зависит от Part, Client)

### 5.1. Entity: Manufacturer

**Источник:** `src/stores/manufacturer-store.ts`

**Структура:**
```
src/entities/manufacturer/
├── index.ts
├── model/
│   ├── manufacturer-types.ts
│   └── manufacturer-store.ts
└── api/
    └── manufacturer-api.ts
```

### 5.2. Entity: ModelCar

**Зависит от:** Manufacturer

**Структура:**
```
src/entities/model-car/
├── index.ts
├── model/
│   ├── model-car-types.ts
│   └── model-car-store.ts
└── api/
    └── model-car-api.ts
```

### 5.3. Entity: Modification

**Зависит от:** ModelCar

**Структура:**
```
src/entities/modification/
├── index.ts
├── model/
│   ├── modification-types.ts
│   └── modification-store.ts
└── api/
    └── modification-api.ts
```

### 5.4. Entity: Order

**Зависит от:** Part, Client

**Источник:** `src/stores/order-store.ts`, `src/apis/orders.ts`, `src/apis/domain/order.ts`

**Структура:**
```
src/entities/order/
├── index.ts
├── model/
│   ├── order-types.ts
│   └── order-store.ts
├── api/
│   └── order-api.ts
└── lib/
    └── order-utils.ts
```

**Типы:**
```typescript
// order-types.ts
export interface Order {
  id: number
  orderNumber: string
  client: {
    id: number
    firstName: string
    lastName: string
    phone: string
  }
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  deliveryAddress?: string
  createdAt: string
  updatedAt: string
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'refunded'

export interface OrderItem {
  id: number
  part: {
    id: number
    name: string
    price: number
  }
  quantity: number
  price: number
}

export interface OrderFilters {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  search?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
  offset?: number
}
```

**API:**
```typescript
// order-api.ts
export const orderApi = {
  async getList(filters: OrderFilters) {
    const query = buildQueryString(filters)
    const { data } = await httpClient.get(`${ENDPOINTS.ORDERS}?${query}`)
    return data
  },

  async getById(id: number) {
    const { data } = await httpClient.get(`${ENDPOINTS.ORDERS}${id}/`)
    return data
  },

  async create(order: CreateOrderDto) {
    const { data } = await httpClient.post(ENDPOINTS.ORDERS, order)
    return data
  },

  async confirm(id: number) {
    const { data } = await httpClient.post(`${ENDPOINTS.ORDERS}${id}/confirm/`)
    return data
  },

  async cancel(id: number) {
    const { data } = await httpClient.post(`${ENDPOINTS.ORDERS}${id}/cancel/`)
    return data
  },

  async confirmPayment(id: number) {
    const { data } = await httpClient.post(`${ENDPOINTS.ORDERS}${id}/confirm-payment/`)
    return data
  },

  async refund(id: number) {
    const { data } = await httpClient.post(`${ENDPOINTS.ORDERS}${id}/refund/`)
    return data
  }
}
```

### Чеклист Фазы 5

- [ ] Manufacturer: types, api, store, index
- [ ] ModelCar: types, api, store, index
- [ ] Modification: types, api, store, index
- [ ] Order: types, api, store, index, lib
- [ ] Тестирование всех entities
- [ ] Проверка зависимостей между entities
- [ ] Коммит: "feat: FSD migration - Phase 5 (Dependent Entities)"

---

## ФАЗА 6: Features (CRUD) ⏳

**Статус:** Ожидает завершения Фазы 5
**Зависимости:** Фазы 3, 4, 5

**Цель:** Выделить CRUD операции в features

### Концепция Features

**Feature** - это самостоятельная функция пользователя. Примеры:
- "Создать запчасть"
- "Удалить заказ"
- "Войти в систему"

**Структура Feature:**
```
src/features/[entity]-[action]/
├── index.ts               # Public API
├── ui/                    # UI компоненты
│   └── FeatureComponent.vue
├── model/                 # Состояние (если нужно)
│   └── feature-store.ts
└── lib/                   # Утилиты (если нужно)
    └── utils.ts
```

### Задачи

#### 6.1. Feature: Auth

- [ ] `features/auth/login/` - форма логина
- [ ] `features/auth/logout/` - кнопка выхода

**Пример:**
```
src/features/auth/
├── login/
│   ├── index.ts
│   └── ui/
│       └── LoginForm.vue
└── logout/
    ├── index.ts
    └── ui/
        └── LogoutButton.vue
```

**LoginForm.vue:**
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@entities/user'

const userStore = useUserStore()
const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

async function handleSubmit() {
  await userStore.login(form.value)
  router.push('/')
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.email" type="email" placeholder="Email" />
    <input v-model="form.password" type="password" placeholder="Пароль" />
    <button type="submit">Войти</button>
  </form>
</template>
```

#### 6.2. Feature: Parts CRUD

- [ ] `features/part/create-part/` - создание запчасти
- [ ] `features/part/edit-part/` - редактирование запчасти
- [ ] `features/part/delete-part/` - удаление запчасти
- [ ] `features/part/delete-parts-bulk/` - массовое удаление

**Пример:**
```
src/features/part/
├── create-part/
│   ├── index.ts
│   ├── ui/
│   │   └── CreatePartForm.vue
│   └── model/
│       └── create-part-form.ts
├── edit-part/
│   ├── index.ts
│   └── ui/
│       └── EditPartForm.vue
└── delete-part/
    ├── index.ts
    └── ui/
        └── DeletePartButton.vue
```

#### 6.3. Feature: Orders CRUD

- [ ] `features/order/create-order/`
- [ ] `features/order/confirm-order/`
- [ ] `features/order/cancel-order/`
- [ ] `features/order/refund-order/`

#### 6.4. Feature: Warehouses CRUD

- [ ] `features/warehouse/create-warehouse/`
- [ ] `features/warehouse/edit-warehouse/`
- [ ] `features/warehouse/delete-warehouse/`

#### 6.5. Feature: Clients CRUD

- [ ] `features/client/create-client/`
- [ ] `features/client/edit-client/`

### Чеклист Фазы 6

- [ ] Auth features (login, logout)
- [ ] Part CRUD features
- [ ] Order CRUD features
- [ ] Warehouse CRUD features
- [ ] Client CRUD features
- [ ] Тестирование features
- [ ] Коммит: "feat: FSD migration - Phase 6 (CRUD Features)"

---

## ФАЗА 7: Features (бизнес-логика) ⏳

**Статус:** Ожидает завершения Фазы 6
**Зависимости:** Фаза 6

**Цель:** Выделить сложную бизнес-логику в features

### Задачи

#### 7.1. Feature: Parts Filtering

**Источник:** `src/stores/filter-store.ts`, `src/components/Parts/PartsFilter.vue`

```
src/features/part/filter-parts/
├── index.ts
├── ui/
│   ├── PartsFilterModal.vue
│   └── FilterForm.vue
└── model/
    └── filter-store.ts
```

**filter-store.ts:**
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PartFilters } from '@entities/part'

export const usePartFilterStore = defineStore('part-filter', () => {
  const filters = ref<PartFilters>({})

  function setFilter(key: keyof PartFilters, value: any) {
    filters.value[key] = value
  }

  function clearFilters() {
    filters.value = {}
  }

  return { filters, setFilter, clearFilters }
})
```

#### 7.2. Feature: Part Image Upload

```
src/features/part/upload-images/
├── index.ts
└── ui/
    └── ImageUploadForm.vue
```

#### 7.3. Feature: Order Payment

```
src/features/order/confirm-payment/
├── index.ts
└── ui/
    └── ConfirmPaymentButton.vue
```

### Чеклист Фазы 7

- [ ] Part filtering feature
- [ ] Part image upload feature
- [ ] Order payment features
- [ ] Feedback close feature
- [ ] Тестирование features
- [ ] Коммит: "feat: FSD migration - Phase 7 (Business Features)"

---

## ФАЗА 8: Widgets ⏳

**Статус:** Ожидает завершения Фаз 6-7
**Зависимости:** Фазы 6, 7

**Цель:** Создать композитные блоки из features + entities

### Концепция Widgets

**Widget** - это сложный блок UI, который:
- Использует несколько features
- Использует несколько entities
- Не имеет бизнес-логики (только композиция)

### Задачи

#### 8.1. Widget: Header

**Источник:** `src/components/TopHeader.vue`, `src/components/Sidebar.vue`

```
src/widgets/header/
├── index.ts
└── ui/
    ├── Header.vue
    └── Sidebar.vue
```

#### 8.2. Widget: Parts Table

**Источник:** `src/views/parts/index.vue` (таблица), `src/components/Parts/`

```
src/widgets/parts-table/
├── index.ts
├── ui/
│   ├── PartsTable.vue
│   └── PartsTableRow.vue
└── lib/
    └── table-columns.ts
```

**PartsTable.vue:**
```vue
<script setup lang="ts">
import { usePartStore } from '@entities/part'
import { DeletePartButton } from '@features/part/delete-part'
import { usePagination } from '@shared/lib/hooks/use-pagination'

const partStore = usePartStore()
const pagination = usePagination({
  totalItems: computed(() => partStore.totalCount),
  onPageChange: (page) => partStore.loadParts({ page })
})

onMounted(() => {
  partStore.loadParts()
})
</script>

<template>
  <div>
    <n-data-table
      :data="partStore.parts"
      :columns="columns"
      :loading="partStore.isLoading"
    />

    <pagination
      :current-page="pagination.currentPage"
      :total-pages="pagination.totalPages"
      @update:current-page="pagination.setPage"
    />
  </div>
</template>
```

#### 8.3. Widget: Orders Table

**Источник:** `src/components/Orders/OrdersTable.vue`

```
src/widgets/orders-table/
├── index.ts
└── ui/
    └── OrdersTable.vue
```

#### 8.4. Widget: Warehouses List

**Источник:** `src/views/warehouses/index.vue`

#### 8.5. Widget: Clients List

**Источник:** `src/views/clients/index.vue`

### Чеклист Фазы 8

- [ ] Header widget
- [ ] Parts table widget
- [ ] Orders table widget
- [ ] Warehouses list widget
- [ ] Clients list widget
- [ ] Feedbacks list widget
- [ ] Тестирование widgets
- [ ] Коммит: "feat: FSD migration - Phase 8 (Widgets)"

---

## ФАЗА 9: Pages ⏳

**Статус:** Ожидает завершения Фазы 8
**Зависимости:** Фаза 8

**Цель:** Мигрировать страницы в pages слой

### Концепция Pages

**Page** - это роут приложения, который:
- Композирует widgets
- Управляет роутингом
- Не содержит бизнес-логику

### Структура

```
src/pages/
├── login/                  # /login
│   └── ui/
│       └── LoginPage.vue
├── profile/                # /profile
│   └── ui/
│       └── ProfilePage.vue
├── parts/
│   ├── list/              # /parts/list
│   │   └── ui/
│   │       └── PartsListPage.vue
│   ├── create/            # /parts/create
│   │   └── ui/
│   │       └── PartCreatePage.vue
│   ├── edit/              # /parts/:id/edit
│   │   └── ui/
│   │       └── PartEditPage.vue
│   └── detail/            # /parts/:id
│       └── ui/
│           └── PartDetailPage.vue
├── orders/
│   ├── list/              # /order/list
│   ├── in-progress/       # /order/list/in-progress
│   ├── create/            # /order/create
│   ├── edit/              # /order/:id/edit
│   └── detail/            # /order/:id
├── warehouses/
│   ├── list/              # /warehouse/list
│   ├── create/            # /warehouse/create
│   ├── edit/              # /warehouse/:id/edit
│   └── detail/            # /warehouse/:id
├── clients/
│   ├── list/              # /clients/list
│   ├── create/            # /clients/create
│   └── detail/            # /clients/:id
└── feedbacks/
    └── list/              # /feedbacks/list
```

### Задачи

#### 9.1. Parts Pages

**Источник:** `src/views/parts/*`

**PartsListPage.vue:**
```vue
<script setup lang="ts">
import { PartsTable } from '@widgets/parts-table'
import { PartsFilter } from '@features/part/filter-parts'
import { CreatePartButton } from '@features/part/create-part'
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Запчасти</h1>
      <div class="actions">
        <PartsFilter />
        <CreatePartButton />
      </div>
    </div>

    <PartsTable />
  </div>
</template>
```

#### 9.2. Orders Pages

**Источник:** `src/views/orders/*`

#### 9.3. Warehouses Pages

**Источник:** `src/views/warehouses/*`

#### 9.4. Clients Pages

**Источник:** `src/views/clients/*`

#### 9.5. Auth Pages

**Источник:** `src/views/auth/*`

### Чеклист Фазы 9

- [ ] Login page
- [ ] Profile page
- [ ] Parts pages (list, create, edit, detail)
- [ ] Orders pages (list, in-progress, create, edit, detail)
- [ ] Warehouses pages (list, create, edit, detail)
- [ ] Clients pages (list, create, detail)
- [ ] Feedbacks page (list)
- [ ] Тестирование навигации
- [ ] Коммит: "feat: FSD migration - Phase 9 (Pages)"

---

## ФАЗА 10: App Layer ⏳

**Статус:** Ожидает завершения Фазы 9
**Зависимости:** Фаза 9

**Цель:** Создать app слой для инициализации приложения

### Структура

```
src/app/
├── index.ts                # Entry point
├── providers/              # Провайдеры
│   ├── router.ts          # Конфигурация роутера
│   ├── pinia.ts           # Конфигурация Pinia
│   └── ui.ts              # Конфигурация UI библиотек
├── styles/                # Глобальные стили
│   ├── index.css
│   ├── tailwind.css
│   └── naive-ui.css
└── config/                # Конфигурация приложения
    └── app-config.ts
```

### Задачи

#### 10.1. Создать providers

**router.ts:**
```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { authGuard } from './guards/auth-guard'

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(authGuard)
```

**routes.ts:**
```typescript
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@pages/login/ui/LoginPage.vue')
  },
  {
    path: '/parts/list',
    component: () => import('@pages/parts/list/ui/PartsListPage.vue'),
    meta: { requiresAuth: true, role: 'all' }
  },
  // ... остальные роуты
]
```

**guards/auth-guard.ts:**
```typescript
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@entities/user'

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return next('/login')
  }

  if (to.meta.role && !userStore.hasRole(to.meta.role as string)) {
    return next('/')
  }

  next()
}
```

**pinia.ts:**
```typescript
import { createPinia } from 'pinia'

export const pinia = createPinia()
```

**ui.ts:**
```typescript
import type { App } from 'vue'
import naive from 'naive-ui'

export function setupUI(app: App) {
  app.use(naive)
}
```

#### 10.2. Создать index.ts

**app/index.ts:**
```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './providers/router'
import { pinia } from './providers/pinia'
import { setupUI } from './providers/ui'
import './styles/index.css'

export function createApplication() {
  const app = createApp(App)

  app.use(router)
  app.use(pinia)
  setupUI(app)

  return app
}
```

#### 10.3. Обновить main.ts

**src/main.ts:**
```typescript
import { createApplication } from '@app'

const app = createApplication()

app.mount('#app')
```

### Чеклист Фазы 10

- [ ] Создать app/providers/
- [ ] Создать app/styles/
- [ ] Создать app/index.ts
- [ ] Обновить main.ts
- [ ] Тестирование инициализации
- [ ] Коммит: "feat: FSD migration - Phase 10 (App Layer)"

---

## ФАЗА 11: Миграция импортов ⏳

**Статус:** Ожидает завершения Фазы 10
**Зависимости:** Все предыдущие фазы

**Цель:** Обновить все импорты на FSD aliases

### Задачи

#### 11.1. Автоматизация замены импортов

Создать скрипт для замены:

```typescript
// scripts/migrate-imports.ts
import { readFile, writeFile } from 'fs/promises'
import { glob } from 'glob'

const replacements = [
  // Entities
  { from: /from ['"]@\/stores\/auth-store['"]/g, to: 'from "@entities/user"' },
  { from: /from ['"]@\/stores\/product-store['"]/g, to: 'from "@entities/part"' },
  // ... остальные замены
]

async function migrateImports() {
  const files = await glob('src/**/*.{ts,vue}')

  for (const file of files) {
    let content = await readFile(file, 'utf-8')
    let changed = false

    for (const { from, to } of replacements) {
      if (from.test(content)) {
        content = content.replace(from, to)
        changed = true
      }
    }

    if (changed) {
      await writeFile(file, content)
      console.log(`Updated: ${file}`)
    }
  }
}

migrateImports()
```

Запустить:
```bash
tsx scripts/migrate-imports.ts
```

#### 11.2. Ручная проверка импортов

Проверить следующие паттерны:

```typescript
// ❌ Старые импорты
import { useAuthStore } from '@/stores/auth-store'
import { getProducts } from '@/apis/products'
import Table from '@/components/Table.vue'

// ✅ Новые импорты
import { useUserStore } from '@entities/user'
import { usePartStore } from '@entities/part'
import { Table } from '@shared/ui/table'
```

### Чеклист Фазы 11

- [ ] Создать скрипт миграции импортов
- [ ] Запустить автоматическую замену
- [ ] Проверить импорты в entities
- [ ] Проверить импорты в features
- [ ] Проверить импорты в widgets
- [ ] Проверить импорты в pages
- [ ] Проверить импорты в app
- [ ] Тестирование сборки (npm run build)
- [ ] Тестирование приложения
- [ ] Коммит: "refactor: migrate all imports to FSD aliases"

---

## ФАЗА 12: Удаление старого кода ⏳

**Статус:** Ожидает завершения Фазы 11
**Зависимости:** Фаза 11

**Цель:** Удалить старые файлы после миграции

### Что удалить

#### 12.1. Старые stores

```
src/stores/
├── auth-store.ts          # → @entities/user
├── product-store.ts       # → @entities/part
├── order-store.ts         # → @entities/order
├── category-storage.ts    # → @entities/category
├── warehouses-store.ts    # → @entities/warehouse
├── manufacturer-store.ts  # → @entities/manufacturer
├── modifications-store.ts # → @entities/modification
├── models.ts              # → типы в entities
├── color-store.ts         # → @entities/color
├── feedback-store.ts      # → @entities/feedback
├── client-store.ts        # → @entities/client
├── filter-store.ts        # → @features/part/filter-parts
└── app.ts                 # → @app (или оставить если нужно)
```

#### 12.2. Старые API файлы

```
src/apis/
├── index.ts              # → @shared/api/base/http-client
├── interfaces.ts         # → @shared/api/base/api-types
├── products.ts           # → @entities/part/api
├── orders.ts             # → @entities/order/api
├── repo.ts               # → @entities/*/api
└── domain/               # → типы в entities
```

#### 12.3. Старые components

Перенести или удалить:
```
src/components/
├── Parts/                # → @widgets или @features
├── Orders/               # → @widgets
├── warehouse/            # → @widgets
└── ...
```

#### 12.4. Старые views

```
src/views/                # → @pages
```

### Стратегия удаления

**⚠️ ВАЖНО:** Не удаляйте файлы сразу! Используйте поэтапный подход:

1. **Шаг 1:** Проверить, что файл не используется
   ```bash
   # Поиск импортов старого файла
   grep -r "from.*stores/auth-store" src/
   ```

2. **Шаг 2:** Переименовать файл в `.old`
   ```bash
   mv src/stores/auth-store.ts src/stores/auth-store.ts.old
   ```

3. **Шаг 3:** Запустить сборку и тесты
   ```bash
   npm run build
   npm run dev
   ```

4. **Шаг 4:** Если все работает, удалить `.old` файлы через 1-2 дня

### Чеклист Фазы 12

- [ ] Проверить, что все stores мигрированы
- [ ] Переименовать stores в .old
- [ ] Тестирование
- [ ] Проверить, что все API мигрированы
- [ ] Переименовать apis в .old
- [ ] Тестирование
- [ ] Проверить, что все components мигрированы
- [ ] Переименовать components в .old
- [ ] Тестирование
- [ ] Проверить, что все views мигрированы
- [ ] Удалить src/views/
- [ ] Финальное тестирование
- [ ] Удалить все .old файлы
- [ ] Коммит: "chore: remove old code after FSD migration"

---

## ФАЗА 13: Тестирование ⏳

**Статус:** Ожидает завершения Фазы 12
**Зависимости:** Все предыдущие фазы

**Цель:** Полное тестирование приложения после миграции

### Тестовые сценарии

#### 13.1. Функциональное тестирование

**Auth:**
- [ ] Вход в систему
- [ ] Выход из системы
- [ ] Проверка ролей
- [ ] Redirect при неавторизованном доступе

**Parts:**
- [ ] Список запчастей загружается
- [ ] Пагинация работает
- [ ] Фильтрация работает
- [ ] Создание запчасти
- [ ] Редактирование запчасти
- [ ] Удаление запчасти
- [ ] Загрузка изображений

**Orders:**
- [ ] Список заказов загружается
- [ ] Создание заказа
- [ ] Редактирование заказа
- [ ] Подтверждение заказа
- [ ] Отмена заказа
- [ ] Возврат заказа
- [ ] Подтверждение оплаты

**Warehouses:**
- [ ] Список складов
- [ ] Создание склада
- [ ] Редактирование склада
- [ ] Удаление склада

**Clients:**
- [ ] Список клиентов
- [ ] Создание клиента
- [ ] Редактирование клиента
- [ ] Поиск клиентов

**Feedbacks:**
- [ ] Список заявок
- [ ] Закрытие заявки

#### 13.2. Техническое тестирование

- [ ] `npm run dev` - dev сервер запускается
- [ ] `npm run build` - сборка проходит без ошибок
- [ ] `npm run preview` - preview работает
- [ ] Нет ошибок в консоли браузера
- [ ] Нет предупреждений TypeScript
- [ ] Все импорты используют FSD aliases
- [ ] Нет циклических зависимостей

#### 13.3. Performance тестирование

- [ ] Время загрузки главной страницы < 3с
- [ ] Размер бандла не увеличился значительно
- [ ] Нет memory leaks
- [ ] Lazy loading работает

### Инструменты тестирования

```bash
# Проверка типов
npm run type-check

# Сборка
npm run build

# Анализ бандла
npm run build -- --analyze

# Проверка циклических зависимостей
npx madge --circular src/

# Проверка неиспользуемых файлов
npx unimported
```

### Чеклист Фазы 13

- [ ] Функциональное тестирование (все сценарии)
- [ ] Техническое тестирование
- [ ] Performance тестирование
- [ ] Исправление найденных багов
- [ ] Документация изменений
- [ ] Коммит: "test: verify FSD migration"

---

## ✅ ЧЕКЛИСТЫ И ПРОГРЕСС

### Общий прогресс миграции

```
┌─────────────────────────────────────────────────────────────┐
│ ПРОГРЕСС МИГРАЦИИ НА FSD                                    │
├─────────────────────────────────────────────────────────────┤
│ ██████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  32%   │
├─────────────────────────────────────────────────────────────┤
│ ✅ Фаза 0: Подготовка                               [100%] │
│ ✅ Фаза 1: Shared слой                              [100%] │
│ ✅ Фаза 2: Entity User                              [100%] │
│ ✅ Фаза 3: Entity Part                              [100%] │
│ ✅ Фаза 4: Entities (базовые)                       [100%] │
│ ⏳ Фаза 5: Entities (зависимые)                     [  0%] │
│ ⏳ Фаза 6: Features (CRUD)                          [  0%] │
│ ⏳ Фаза 7: Features (бизнес)                        [  0%] │
│ ⏳ Фаза 8: Widgets                                  [  0%] │
│ ⏳ Фаза 9: Pages                                    [  0%] │
│ ⏳ Фаза 10: App layer                               [  0%] │
│ ⏳ Фаза 11: Миграция импортов                       [  0%] │
│ ⏳ Фаза 12: Удаление старого кода                   [  0%] │
│ ⏳ Фаза 13: Тестирование                            [  0%] │
└─────────────────────────────────────────────────────────────┘
```

### Прогресс по слоям

#### Shared (100%)
- ✅ api/base
- ✅ api/interceptors
- ✅ api/lib
- ✅ lib/formatters
- ✅ lib/utils
- ✅ lib/hooks

#### Entities (64% - 7 из 11)
- ✅ user
- ✅ part
- ✅ category
- ✅ warehouse
- ✅ color
- ✅ feedback
- ✅ client
- ⏳ order
- ⏳ manufacturer
- ⏳ model-car
- ⏳ modification
- ⏳ client
- ⏳ feedback
- ⏳ color

#### Features (0%)
- ⏳ auth/*
- ⏳ part/*
- ⏳ order/*
- ⏳ warehouse/*
- ⏳ client/*

#### Widgets (0%)
- ⏳ header
- ⏳ parts-table
- ⏳ orders-table
- ⏳ warehouses-list
- ⏳ clients-list

#### Pages (0%)
- ⏳ login
- ⏳ profile
- ⏳ parts/*
- ⏳ orders/*
- ⏳ warehouses/*
- ⏳ clients/*
- ⏳ feedbacks/*

#### App (0%)
- ⏳ providers
- ⏳ styles
- ⏳ index

---

## ⚠️ РИСКИ И ПРОБЛЕМЫ

### Технические риски

#### 1. Циклические зависимости
**Риск:** Entities могут импортировать друг друга
**Решение:** Использовать shared/api для общих типов, избегать прямых импортов между entities

#### 2. Breaking changes
**Риск:** Изменение API stores может сломать компоненты
**Решение:** Поэтапная миграция, параллельное существование старого и нового кода

#### 3. Сложность рефакторинга монолитных компонентов
**Риск:** Компоненты вроде `views/parts/index.vue` содержат 200+ строк
**Решение:** Разбить на widgets + features

#### 4. TypeScript ошибки
**Риск:** Изменение типов может привести к ошибкам компиляции
**Решение:** Постепенная миграция типов, использование `any` как временное решение (с TODO)

### Организационные риски

#### 1. Потеря функциональности
**Риск:** При миграции можно забыть перенести функционал
**Решение:** Чеклисты, параллельное существование старого кода

#### 2. Увеличение времени разработки
**Риск:** Миграция занимает время, новые фичи откладываются
**Решение:** Миграция фазами, возможность разработки новых фич в FSD сразу

### Минимизация рисков

1. **Используйте Git branches**
   ```bash
   git checkout -b feature/fsd-migration-phase-3
   ```

2. **Делайте частые коммиты**
   ```bash
   git add .
   git commit -m "feat: migrate Part entity (step 1/3)"
   ```

3. **Создавайте backup перед большими изменениями**
   ```bash
   git tag backup-before-phase-3
   ```

4. **Тестируйте после каждой фазы**

---

## 💡 FAQ

### Q1: Можно ли использовать entity внутри entity?

**A:** Нет, прямые импорты запрещены. Используйте:
- Shared типы для общих интерфейсов
- Feature для бизнес-логики, связывающей entities

```typescript
// ❌ Плохо
// entities/order/model/order-store.ts
import { usePartStore } from '@entities/part'

// ✅ Хорошо
// features/order/create-order/model/create-order.ts
import { useOrderStore } from '@entities/order'
import { usePartStore } from '@entities/part'
```

### Q2: Куда поместить общие типы?

**A:** Зависит от использования:
- Если используется только в одном entity → `entities/[name]/model/types.ts`
- Если используется в нескольких entities → `shared/api/base/api-types.ts`
- Если относится к domain → `shared/types/domain.ts`

### Q3: Как быть с утилитами, используемыми только в одном entity?

**A:** Поместить в `entities/[name]/lib/utils.ts`

### Q4: Нужно ли создавать UI компоненты в entities?

**A:** Опционально. Если компонент специфичен для entity и переиспользуется - да.
Пример: `entities/user/ui/UserAvatar.vue`

### Q5: Что если фича использует несколько entities?

**A:** Это нормально! Feature может импортировать несколько entities.

```typescript
// features/order/create-order/model/create-order.ts
import { useOrderStore } from '@entities/order'
import { usePartStore } from '@entities/part'
import { useClientStore } from '@entities/client'
```

### Q6: Как мигрировать, если новые задачи продолжают поступать?

**A:** Новые фичи сразу пишите в FSD. Старый код мигрируйте постепенно.

### Q7: Нужно ли удалять старый код сразу?

**A:** Нет! Оставьте старый код до полной миграции и тестирования.

### Q8: Что делать с глобальными компонентами?

**A:** Перенести в `shared/ui/` и регистрировать глобально в `app/providers/ui.ts`

---

## 📚 ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ

### Документация FSD
- [Официальная документация](https://feature-sliced.design/)
- [FSD на русском](https://feature-sliced.design/ru/)

### Примеры проектов на FSD
- [Real World App](https://github.com/feature-sliced/examples)
- [Tutorial](https://feature-sliced.design/ru/docs/get-started/tutorial)

### Инструменты
- [Steiger](https://github.com/feature-sliced/steiger) - линтер для FSD
- [ESLint plugin](https://github.com/feature-sliced/eslint-config)

---

## 🎯 КОМАНДЫ ДЛЯ БЫСТРОГО СТАРТА

```bash
# Продолжить Фазу 3 (Part Entity)
# 1. Создать part-api.ts
# 2. Создать part-store.ts
# 3. Создать index.ts
# 4. Тестировать

# Проверить прогресс
grep -r "from.*stores" src/ | wc -l  # Количество старых импортов

# Проверить сборку
npm run build

# Запустить dev сервер
npm run dev
```

---

## 📅 ИСТОРИЯ ИЗМЕНЕНИЙ

| Дата | Фаза | Описание |
|------|------|----------|
| 2025-12-16 | 0-2 | Начальная миграция: Shared + Entity User |
| 2025-12-16 | 3 | Начата миграция Entity Part (types) |
| 2025-12-16 | - | Создан план полной миграции |
| 2025-12-16 | 3 | Завершена миграция Entity Part (api + store + index) |
| 2025-12-16 | 4 | Завершена миграция Base Entities (Category, Warehouse, Color, Feedback, Client) |

---

## ✨ ФИНАЛЬНАЯ СТРУКТУРА (ЦЕЛЬ)

```
src/
├── app/
│   ├── index.ts
│   ├── App.vue
│   ├── providers/
│   ├── styles/
│   └── config/
├── pages/
│   ├── login/
│   ├── profile/
│   ├── parts/
│   ├── orders/
│   ├── warehouses/
│   ├── clients/
│   └── feedbacks/
├── widgets/
│   ├── header/
│   ├── parts-table/
│   ├── orders-table/
│   └── ...
├── features/
│   ├── auth/
│   ├── part/
│   ├── order/
│   ├── warehouse/
│   └── client/
├── entities/
│   ├── user/
│   ├── part/
│   ├── order/
│   ├── warehouse/
│   ├── category/
│   ├── manufacturer/
│   ├── model-car/
│   ├── modification/
│   ├── client/
│   ├── feedback/
│   └── color/
└── shared/
    ├── api/
    ├── ui/
    ├── lib/
    └── config/
```

---

**Последнее обновление:** 2025-12-16
**Текущая фаза:** 4 завершена ✅ (Base Entities - 100%)
**Следующий шаг:** Фаза 5 - Dependent Entities (Manufacturer, ModelCar, Modification, Order)

---

**Good luck! 🚀**
