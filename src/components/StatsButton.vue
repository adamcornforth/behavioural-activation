<script setup lang="ts">
import { computed } from 'vue'
import { useActivityStore } from '../store/activityStore'
import Button from './ui/button.vue'

// Props to control the stats visibility
defineProps<{
  showStats: boolean
}>()

// Emit events to parent
const emit = defineEmits<{
  toggleStats: []
}>()

const activityStore = useActivityStore()

// Calculate basic stats
const stats = computed(() => {
  const completedActivities = activityStore.getCompletedActivities()
  const totalCompleted = completedActivities.length
  
  return {
    totalCompleted
  }
})

const handleToggle = () => {
  emit('toggleStats')
}
</script>

<template>
  <Button 
    v-if="stats.totalCompleted > 0"
    variant="outline" 
    size="sm" 
    @click="handleToggle"
    class="flex items-center gap-1 md:gap-2 text-xs md:text-sm py-1 px-2 md:py-1.5 md:px-3"
  >
    <span v-if="!showStats">Show Statistics</span>
    <span v-else>Hide Statistics</span>
    <span v-if="stats.totalCompleted > 0" class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-1.5 py-0.5 md:px-2 rounded-full">
      {{ stats.totalCompleted }}
    </span>
  </Button>
</template>