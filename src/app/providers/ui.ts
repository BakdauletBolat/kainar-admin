/**
 * UI configuration
 * Конфигурация UI библиотек (Naive UI)
 */

import type { App } from 'vue'
import naive from 'naive-ui'

export function setupUI(app: App) {
  app.use(naive)
}
