<script setup lang="ts">
import { RouterView } from 'vue-router'
import HomePage from './pages/HomePage.vue'
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="container py-6 md:py-8">
      <h1 class="text-3xl font-bold tracking-tight">Behavioural Activation</h1>
    </header>
    <main class="container py-6">
      <HomePage />
    </main>
  </div>
</template>
