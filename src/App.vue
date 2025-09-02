<script setup lang="ts">
import HomePage from './pages/HomePage.vue'
import ActivityStoreProvider from './providers/ActivityStoreProvider.vue'
import WelcomeModal from './components/WelcomeModal.vue'
import { ref, onMounted, watch } from 'vue'
import { Moon, Sun, HelpCircle } from 'lucide-vue-next'

const darkMode = ref(true)
const showWelcomeModal = ref(false)

// Initialize dark mode and check for first run
onMounted(() => {
  const savedMode = localStorage.getItem('darkMode')
  if (savedMode !== null) {
    darkMode.value = savedMode === 'true'
    applyDarkMode(darkMode.value)
  } else {
    // Default to dark mode
    darkMode.value = true
    applyDarkMode(true)
  }

  // Check if this is the first time visiting the app
  const hasVisited = localStorage.getItem('hasVisitedApp')
  if (!hasVisited) {
    showWelcomeModal.value = true
    localStorage.setItem('hasVisitedApp', 'true')
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

// Close welcome modal
function closeWelcomeModal() {
  showWelcomeModal.value = false
}

// Show help modal
function showHelp() {
  showWelcomeModal.value = true
}
</script>

<template>
  <ActivityStoreProvider>
    <div class="bg-background h-screen max-h-screen flex flex-col dark:bg-gray-900 dark:text-white transition-colors duration-200">
      <header class="container pt-4 md:pt-6 pb-2 flex justify-between items-center flex-shrink-0">
        <h1 class="text-xl md:text-3xl font-bold tracking-tight">Behavioural Activation</h1>
        <div class="flex items-center gap-2">
          <button 
            @click="showHelp" 
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Show help"
            title="Show help"
          >
            <HelpCircle class="h-5 w-5" />
          </button>
          <button 
            @click="toggleDarkMode" 
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            <Sun v-if="darkMode" class="h-5 w-5" />
            <Moon v-else class="h-5 w-5" />
          </button>
        </div>
      </header>
      <main class="container flex-1 overflow-hidden">
        <HomePage />
      </main>
    </div>
    
    <!-- Welcome Modal -->
    <WelcomeModal 
      :open="showWelcomeModal" 
      @close="closeWelcomeModal" 
    />
  </ActivityStoreProvider>
</template>
