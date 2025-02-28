<script setup lang="ts">
import { computed, ref } from 'vue'
import { useActivityStore } from '../store/activityStore'
import Card from './ui/card.vue'
import CardHeader from './ui/card-header.vue'
import CardTitle from './ui/card-title.vue'
import CardContent from './ui/card-content.vue'
import Button from './ui/button.vue'
import ActivityModal from './ActivityModal.vue'

const activityStore = useActivityStore()
const showStats = ref(false)

// Activity modal state
const showActivityModal = ref(false)
const currentActivity = ref(null)
const provideFeedback = ref(false)

// Function to open activity modal for feedback
const openFeedbackModal = (activity) => {
  currentActivity.value = activity
  provideFeedback.value = true
  showActivityModal.value = true
}

// Handle activity update
const handleActivityUpdate = (updatedActivity) => {
  activityStore.updateActivity(updatedActivity.id, updatedActivity)
  showActivityModal.value = false
  currentActivity.value = null
  provideFeedback.value = false
}

// Handle modal close
const handleModalClose = () => {
  showActivityModal.value = false
  currentActivity.value = null
  provideFeedback.value = false
}

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
    <!-- Activity Modal for feedback -->
    <ActivityModal
      :open="showActivityModal"
      :edit-activity="currentActivity"
      :provide-feedback="provideFeedback"
      @close="handleModalClose"
      @submit="handleActivityUpdate"
    />
    
    <!-- Activities needing feedback -->
    <div v-if="activityStore.getPendingFeedbackActivities().length > 0" class="mb-4">
      <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md border border-blue-100 dark:border-blue-800">
        <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Activities Needing Feedback</h3>
        <div class="space-y-2">
          <div 
            v-for="activity in activityStore.getPendingFeedbackActivities().slice(0, 3)" 
            :key="activity.id"
            class="flex justify-between items-center bg-white dark:bg-gray-800 p-2 rounded shadow-sm"
          >
            <div class="text-sm">{{ activity.activityName }}</div>
            <Button size="sm" @click="openFeedbackModal(activity)">
              Give Feedback
            </Button>
          </div>
        </div>
        <div v-if="activityStore.getPendingFeedbackActivities().length > 3" class="mt-2 text-xs text-blue-600 dark:text-blue-400">
          + {{ activityStore.getPendingFeedbackActivities().length - 3 }} more activities need feedback
        </div>
      </div>
    </div>
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
