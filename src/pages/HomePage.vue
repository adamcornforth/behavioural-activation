<script setup lang="ts">
import Calendar from '../components/Calendar.vue'
import StatsPanel from '../components/StatsPanel.vue'
</script>

<template>
  <div class="h-full flex flex-col">
    <section class="mb-4 flex-shrink-0">
      <p class="text-muted-foreground dark:text-gray-300 text-lg mb-2">A tool to help you engage in meaningful activities</p>
    </section>
    
    <div class="flex-shrink-0 mb-2">
      <StatsPanel />
    </div>
    
    <section class="flex-1 overflow-hidden">
      <div class="bg-white dark:bg-gray-800 rounded-t-lg drop-shadow-lg border dark:border-gray-700 px-4 pt-4 transition-colors duration-200 h-full">
        <Calendar />
      </div>
    </section>
  </div>
</template>
