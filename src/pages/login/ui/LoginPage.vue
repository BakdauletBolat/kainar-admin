<template>
  <div class="login-page">
    <div class="login-container">
      <n-card title="Вход в систему" class="login-card">
        <LoginForm />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard } from 'naive-ui'
import { LoginForm } from '@features/auth/login'
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
</style>
