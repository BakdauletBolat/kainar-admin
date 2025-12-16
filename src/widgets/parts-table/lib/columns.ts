/**
 * Parts Table Columns Configuration
 * Конфигурация колонок для таблицы запчастей
 */

export const partsTableColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: 'Название',
    key: 'name'
  },
  {
    title: 'Цена',
    key: 'price',
    width: 120
  },
  {
    title: 'Статус',
    key: 'status',
    width: 120
  },
  {
    title: 'Склад',
    key: 'warehouse.name',
    width: 150
  },
  {
    title: 'Категория',
    key: 'category.name',
    width: 150
  },
  {
    title: 'Действия',
    key: 'actions',
    width: 150
  }
]
