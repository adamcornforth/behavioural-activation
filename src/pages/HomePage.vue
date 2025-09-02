<script setup lang="ts">
import Calendar from '../components/Calendar.vue'
import StatsPanel from '../components/StatsPanel.vue'
</script>

<template>
  <div>
    <section class="mb-4">
      <p class="text-muted-foreground dark:text-gray-300 text-lg mb-2">A tool to help you engage in meaningful activities</p>
    </section>
    
    <StatsPanel />
    
    <section>
      <div class="bg-white dark:bg-gray-800 rounded-t-lg drop-shadow-lg border dark:border-gray-700 px-4 pt-4 transition-colors duration-200">
        <Calendar />
      </div>
    </section>
  </div>
</template>
