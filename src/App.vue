<script setup lang="ts">
import HomePage from './pages/HomePage.vue'
import ActivityStoreProvider from './providers/ActivityStoreProvider.vue'
import { ref, onMounted, watch } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'

const darkMode = ref(false)

// Initialize dark mode from localStorage
onMounted(() => {
  const savedMode = localStorage.getItem('darkMode')
  if (savedMode !== null) {
    darkMode.value = savedMode === 'true'
    applyDarkMode(darkMode.value)
  } else {
    // Check for system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    darkMode.value = prefersDark
    applyDarkMode(prefersDark)
  }
})

// Watch for changes and apply them
watch(darkMode, (newValue) => {
  applyDarkMode(newValue)
  localStorage.setItem('darkMode', newValue.toString())
})

// Apply dark mode to document
function applyDarkMode(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Toggle dark mode
function toggleDarkMode() {
  darkMode.value = !darkMode.value
}
</script>

<template>
  <ActivityStoreProvider>
    <div class="bg-background h-100 dark:bg-gray-900 dark:text-white transition-colors duration-200">
      <header class="container pt-4 md:pt-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold tracking-tight">Behavioural Activation</h1>
        <button 
          @click="toggleDarkMode" 
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          <Sun v-if="darkMode" class="h-5 w-5" />
          <Moon v-else class="h-5 w-5" />
        </button>
      </header>
      <main class="container pt-2">
        <HomePage />
      </main>
    </div>
  </ActivityStoreProvider>
</template>
