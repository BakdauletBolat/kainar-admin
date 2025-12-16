/**
 * Application entry point
 * Точка входа приложения
 */

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './providers/router'
import { pinia } from './providers/pinia'
import { setupUI } from './providers/ui'
import './styles/index.css'

export function createApplication() {
  const app = createApp(App)

  // Meta tag для Naive UI
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)

  // Providers
  app.use(pinia)
  app.use(router)
  setupUI(app)

  return app
}
