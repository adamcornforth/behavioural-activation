<script setup lang="ts">
import { ref } from 'vue'
import Calendar from '../components/Calendar.vue'
import StatsPanel from '../components/StatsPanel.vue'
import StatsButton from '../components/StatsButton.vue'

const showStats = ref(false)

const toggleStats = () => {
  showStats.value = !showStats.value
}
</script>

<template>
  <div class="h-full flex flex-col">
    <section class="mb-2 md:mb-4 flex-shrink-0">
      <div class="flex items-center justify-between">
        <p class="text-muted-foreground dark:text-gray-300 text-xs md:text-lg">A tool to help you engage in meaningful activities</p>
        <StatsButton :show-stats="showStats" @toggle-stats="toggleStats" />
      </div>
    </section>
    
    <div class="flex-shrink-0 mb-1 md:mb-2">
      <StatsPanel :show-stats="showStats" />
    </div>
    
    <section class="flex-1 overflow-hidden">
      <div class="bg-white dark:bg-gray-800 rounded-t-lg drop-shadow-lg border dark:border-gray-700 px-4 pt-4 transition-colors duration-200 h-full">
        <Calendar />
      </div>
    </section>
  </div>
</template>
