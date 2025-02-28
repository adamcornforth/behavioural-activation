<script setup lang="ts">
import { computed, ref } from 'vue'
import { useActivityStore } from '../store/activityStore'
import Card from './ui/card.vue'
import CardHeader from './ui/card-header.vue'
import CardTitle from './ui/card-title.vue'
import CardContent from './ui/card-content.vue'
import Button from './ui/button.vue'

const activityStore = useActivityStore()
const showStats = ref(false)

// Calculate statistics
const stats = computed(() => {
  const completedActivities = activityStore.getCompletedActivities()
  const totalCompleted = completedActivities.length
  
  // Only consider activities with both expected and actual values
  const activitiesWithFeedback = completedActivities.filter(
    activity => activity.expectedDifficulty !== undefined && 
                activity.actualDifficulty !== undefined &&
                activity.expectedMood !== undefined &&
                activity.actualMood !== undefined
  )
  
  // Calculate average difficulty difference (expected - actual)
  let avgDifficultyDiff = 0
  if (activitiesWithFeedback.length > 0) {
    const totalDifficultyDiff = activitiesWithFeedback.reduce(
      (sum, activity) => sum + (activity.expectedDifficulty! - activity.actualDifficulty!), 
      0
    )
    avgDifficultyDiff = totalDifficultyDiff / activitiesWithFeedback.length
  }
  
  // Calculate average mood improvement (actual - expected)
  let avgMoodImprovement = 0
  if (activitiesWithFeedback.length > 0) {
    const totalMoodImprovement = activitiesWithFeedback.reduce(
      (sum, activity) => sum + (activity.actualMood! - activity.expectedMood!), 
      0
    )
    avgMoodImprovement = totalMoodImprovement / activitiesWithFeedback.length
  }
  
  return {
    totalCompleted,
    avgDifficultyDiff: avgDifficultyDiff.toFixed(1),
    avgMoodImprovement: avgMoodImprovement.toFixed(1)
  }
})
</script>

<template>
  <div class="mb-6">
    <div class="flex justify-end mb-2" v-if="stats.totalCompleted > 0">
      <Button 
        variant="outline" 
        size="sm" 
        @click="showStats = !showStats"
        class="flex items-center gap-2"
      >
        <span v-if="!showStats">Show Statistics</span>
        <span v-else>Hide Statistics</span>
        <span v-if="stats.totalCompleted > 0" class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2 py-0.5 rounded-full">
          {{ stats.totalCompleted }}
        </span>
      </Button>
    </div>
    
    <Card v-if="showStats">
      <CardHeader>
        <CardTitle>Activity Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-muted-foreground">Activities Completed</span>
            <span class="font-medium">{{ stats.totalCompleted }}</span>
          </div>
          
          <div class="flex flex-col gap-1">
            <div class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground">Avg. Difficulty Difference</span>
              <span class="font-medium" :class="Number(stats.avgDifficultyDiff) > 0 ? 'text-green-500' : Number(stats.avgDifficultyDiff) < 0 ? 'text-red-500' : ''">
                {{ Number(stats.avgDifficultyDiff) > 0 ? '+' : '' }}{{ stats.avgDifficultyDiff }}
              </span>
            </div>
            <div class="text-xs text-muted-foreground italic">
              (Positive means activities were easier than expected)
            </div>
          </div>
          
          <div class="flex flex-col gap-1">
            <div class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground">Avg. Mood Improvement</span>
              <span class="font-medium" :class="Number(stats.avgMoodImprovement) > 0 ? 'text-green-500' : Number(stats.avgMoodImprovement) < 0 ? 'text-red-500' : ''">
                {{ Number(stats.avgMoodImprovement) > 0 ? '+' : '' }}{{ stats.avgMoodImprovement }}
              </span>
            </div>
            <div class="text-xs text-muted-foreground italic">
              (Positive means activities improved mood)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
