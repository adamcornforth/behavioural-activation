<script setup lang="ts">
import { RouterView } from 'vue-router'
import HomePage from './pages/HomePage.vue'
</script>

<template>
  <div class="app">
    <header>
      <h1>Behavioural Activation</h1>
    </header>
    <main>
      <HomePage />
    </main>
  </div>
</template>

<style scoped>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
