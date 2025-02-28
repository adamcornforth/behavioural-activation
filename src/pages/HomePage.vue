<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from '../components/ui/button.vue'
import Calendar from '../components/Calendar.vue'
</script>

<template>
  <div>
    <section class="mb-4">
      <p class="text-muted-foreground text-lg mb-2">A tool to help you engage in meaningful activities</p>
    </section>
    
    <section>
      <div class="bg-white rounded-lg shadow-sm border p-4">
        <Calendar />
      </div>
    </section>
  </div>
</template>
