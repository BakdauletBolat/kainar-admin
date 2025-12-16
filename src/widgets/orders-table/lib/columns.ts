/**
 * Orders Table Columns Configuration
 * Конфигурация колонок для таблицы заказов
 */

export const ordersTableColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: 'Клиент',
    key: 'client.name',
    width: 200
  },
  {
    title: 'Сумма',
    key: 'total_price',
    width: 120
  },
  {
    title: 'Статус',
    key: 'status',
    width: 150
  },
  {
    title: 'Оплата',
    key: 'payment_status',
    width: 150
  },
  {
    title: 'Дата создания',
    key: 'created_at',
    width: 180
  },
  {
    title: 'Действия',
    key: 'actions',
    width: 300
  }
]
