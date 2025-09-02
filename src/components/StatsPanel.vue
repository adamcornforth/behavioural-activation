<script setup lang="ts">
import { computed, ref } from 'vue'
import { useActivityStore } from '../store/activityStore'
import Card from './ui/card.vue'
import CardHeader from './ui/card-header.vue'
import CardTitle from './ui/card-title.vue'
import CardContent from './ui/card-content.vue'
import CardFooter from './ui/card-footer.vue'
import CardDescription from './ui/card-description.vue'
import Button from './ui/button.vue'
import ActivityModal from './ActivityModal.vue'

const activityStore = useActivityStore()
const showStats = ref(false)
const activeTab = ref('overview') // 'overview', 'activities'

// Activity modal state
const showActivityModal = ref(false)
const currentActivity = ref<any>(undefined)
const provideFeedback = ref(false)

// Function to open activity modal for feedback
const openFeedbackModal = (activity: any) => {
  currentActivity.value = activity
  provideFeedback.value = true
  showActivityModal.value = true
}

// Handle activity update
const handleActivityUpdate = (updatedActivity: any) => {
  activityStore.updateActivity(updatedActivity.id, updatedActivity)
  showActivityModal.value = false
  currentActivity.value = undefined
  provideFeedback.value = false
}

// Handle modal close
const handleModalClose = () => {
  showActivityModal.value = false
  currentActivity.value = undefined
  provideFeedback.value = false
}

// Calculate statistics
const stats = computed(() => {
  const completedActivities = activityStore.getCompletedActivities()
  const totalCompleted = completedActivities.length
  const upcomingActivities = activityStore.getUpcomingActivities()
  const totalUpcoming = upcomingActivities.length
  
  // Only consider activities with both expected and actual values
  const activitiesWithFeedback = completedActivities.filter(
    activity => activity.expectedDifficulty !== undefined && 
                activity.actualDifficulty !== undefined &&
                activity.expectedMood !== undefined &&
                activity.actualMood !== undefined
  )
  
  const totalWithFeedback = activitiesWithFeedback.length
  
  // Calculate average difficulty difference as a percentage
  let avgDifficultyDiffPercent = 0
  if (activitiesWithFeedback.length > 0) {
    const totalDifficultyDiffPercent = activitiesWithFeedback.reduce(
      (sum, activity) => {
        // Calculate percentage: (expected - actual) / expected * 100
        // Positive percentage means activity was easier than expected
        const expected = activity.expectedDifficulty!
        const actual = activity.actualDifficulty!
        const diffPercent = ((expected - actual) / expected) * 100
        return sum + diffPercent
      }, 
      0
    )
    avgDifficultyDiffPercent = totalDifficultyDiffPercent / activitiesWithFeedback.length
  }
  
  // Calculate average mood improvement as a percentage
  let avgMoodImprovementPercent = 0
  if (activitiesWithFeedback.length > 0) {
    const totalMoodImprovementPercent = activitiesWithFeedback.reduce(
      (sum, activity) => {
        // Calculate percentage: (actual - expected) / expected * 100
        // Positive percentage means mood improved more than expected
        const expected = activity.expectedMood!
        const actual = activity.actualMood!
        const improvementPercent = ((actual - expected) / expected) * 100
        return sum + improvementPercent
      }, 
      0
    )
    avgMoodImprovementPercent = totalMoodImprovementPercent / activitiesWithFeedback.length
  }
  
  // Calculate activity type distribution
  const activityTypes: Record<string, number> = {}
  completedActivities.forEach(activity => {
    const type = activity.activityType || 'other'
    activityTypes[type] = (activityTypes[type] || 0) + 1
  })
  
  // Find most common activity type
  let mostCommonType = 'none'
  let maxCount = 0
  Object.entries(activityTypes).forEach(([type, count]) => {
    if (count > maxCount) {
      mostCommonType = type
      maxCount = count
    }
  })
  
  // Calculate activity type statistics
  const typeStats: Record<string, {
    count: number,
    avgDifficulty: number,
    avgMood: number,
    difficultyDiffPercent: number,
    moodImprovementPercent: number
  }> = {}
  
  // Initialize type stats
  Object.keys(activityTypes).forEach(type => {
    typeStats[type] = {
      count: 0,
      avgDifficulty: 0,
      avgMood: 0,
      difficultyDiffPercent: 0,
      moodImprovementPercent: 0
    }
  })
  
  // Calculate stats for each activity type
  activitiesWithFeedback.forEach(activity => {
    const type = activity.activityType || 'other'
    
    if (!typeStats[type]) {
      typeStats[type] = {
        count: 0,
        avgDifficulty: 0,
        avgMood: 0,
        difficultyDiffPercent: 0,
        moodImprovementPercent: 0
      }
    }
    
    typeStats[type].count++
    typeStats[type].avgDifficulty += activity.actualDifficulty!
    typeStats[type].avgMood += activity.actualMood!
    
    // Calculate difficulty difference percentage
    const difficultyDiffPercent = ((activity.expectedDifficulty! - activity.actualDifficulty!) / activity.expectedDifficulty!) * 100
    typeStats[type].difficultyDiffPercent += difficultyDiffPercent
    
    // Calculate mood improvement percentage
    const moodImprovementPercent = ((activity.actualMood! - activity.expectedMood!) / activity.expectedMood!) * 100
    typeStats[type].moodImprovementPercent += moodImprovementPercent
  })
  
  // Calculate averages for each type
  Object.keys(typeStats).forEach(type => {
    if (typeStats[type].count > 0) {
      typeStats[type].avgDifficulty /= typeStats[type].count
      typeStats[type].avgMood /= typeStats[type].count
      typeStats[type].difficultyDiffPercent /= typeStats[type].count
      typeStats[type].moodImprovementPercent /= typeStats[type].count
    }
  })
  
  // Find best and worst activity types
  let easiestType = { type: 'none', value: -Infinity }
  let hardestType = { type: 'none', value: Infinity }  // Changed to Infinity for finding minimum
  let bestMoodType = { type: 'none', value: -Infinity }
  let worstMoodType = { type: 'none', value: Infinity } // Changed to Infinity for finding minimum
  
  Object.entries(typeStats).forEach(([type, stats]) => {
    if (stats.count >= 1) { // Consider types with at least 1 activity
      // Easiest type (highest positive difficulty difference)
      if (stats.difficultyDiffPercent > easiestType.value) {
        easiestType = { type, value: stats.difficultyDiffPercent }
      }
      
      // Hardest type (lowest difficulty difference - regardless of sign)
      // Lower value means harder (less easy) than other activities
      if (stats.difficultyDiffPercent < hardestType.value) {
        hardestType = { type, value: stats.difficultyDiffPercent }
      }
      
      // Best mood type (highest positive mood improvement)
      if (stats.moodImprovementPercent > bestMoodType.value) {
        bestMoodType = { type, value: stats.moodImprovementPercent }
      }
      
      // Worst mood type (lowest mood improvement - regardless of sign)
      // Lower value means worse mood impact than other activities
      if (stats.moodImprovementPercent < worstMoodType.value) {
        worstMoodType = { type, value: stats.moodImprovementPercent }
      }
    }
  })
  
  // Calculate average actual mood and difficulty
  let avgActualMood = 0
  let avgActualDifficulty = 0
  let avgExpectedMood = 0
  let avgExpectedDifficulty = 0
  let moodDiffPercent = 0
  let difficultyDiffPercent = 0
  
  if (activitiesWithFeedback.length > 0) {
    // Calculate actual averages - ensure we're working with numbers
    avgActualMood = activitiesWithFeedback.reduce(
      (sum, activity) => sum + Number(activity.actualMood || 0), 0
    ) / activitiesWithFeedback.length
    
    avgActualDifficulty = activitiesWithFeedback.reduce(
      (sum, activity) => sum + Number(activity.actualDifficulty || 0), 0
    ) / activitiesWithFeedback.length
    
    // Calculate expected averages - ensure we're working with numbers
    avgExpectedMood = activitiesWithFeedback.reduce(
      (sum, activity) => sum + Number(activity.expectedMood || 0), 0
    ) / activitiesWithFeedback.length
    
    avgExpectedDifficulty = activitiesWithFeedback.reduce(
      (sum, activity) => sum + Number(activity.expectedDifficulty || 0), 0
    ) / activitiesWithFeedback.length
    
    // Calculate percentage differences
    moodDiffPercent = ((avgActualMood - avgExpectedMood) / avgExpectedMood) * 100
    difficultyDiffPercent = ((avgExpectedDifficulty - avgActualDifficulty) / avgExpectedDifficulty) * 100
    
    // Ensure values are within expected range (1-10)
    avgActualMood = Math.min(10, Math.max(1, avgActualMood))
    avgActualDifficulty = Math.min(10, Math.max(1, avgActualDifficulty))
    avgExpectedMood = Math.min(10, Math.max(1, avgExpectedMood))
    avgExpectedDifficulty = Math.min(10, Math.max(1, avgExpectedDifficulty))
  }
  
  // Calculate prediction accuracy percentage
  let predictionAccuracy = 0
  if (activitiesWithFeedback.length > 0) {
    const totalAccuracy = activitiesWithFeedback.reduce((sum, activity) => {
      // Calculate how close the prediction was (as a percentage)
      const difficultyAccuracy = 100 - Math.abs(activity.expectedDifficulty! - activity.actualDifficulty!) * 10
      const moodAccuracy = 100 - Math.abs(activity.expectedMood! - activity.actualMood!) * 10
      return sum + (difficultyAccuracy + moodAccuracy) / 2
    }, 0)
    
    predictionAccuracy = totalAccuracy / activitiesWithFeedback.length
  }
  
  // Log type stats for debugging
  console.log('Type stats:', JSON.stringify(typeStats, null, 2))
  console.log('Easiest type:', easiestType)
  console.log('Hardest type:', hardestType)
  console.log('Best mood type:', bestMoodType)
  console.log('Worst mood type:', worstMoodType)
  
  return {
    totalCompleted,
    totalUpcoming,
    totalWithFeedback,
    avgDifficultyDiffPercent: avgDifficultyDiffPercent.toFixed(0),
    avgMoodImprovementPercent: avgMoodImprovementPercent.toFixed(0),
    mostCommonType,
    activityTypeCount: maxCount,
    avgActualMood: avgActualMood.toFixed(1),
    avgActualDifficulty: avgActualDifficulty.toFixed(1),
    avgExpectedMood: avgExpectedMood.toFixed(1),
    avgExpectedDifficulty: avgExpectedDifficulty.toFixed(1),
    moodDiffPercent: moodDiffPercent.toFixed(0),
    difficultyDiffPercent: difficultyDiffPercent.toFixed(0),
    predictionAccuracy: predictionAccuracy.toFixed(0),
    // New activity type insights
    easiestType: easiestType.type !== 'none' ? {
      type: easiestType.type,
      percent: easiestType.value.toFixed(0)
    } : null,
    hardestType: hardestType.type !== 'none' ? {
      type: hardestType.type,
      percent: hardestType.value.toFixed(0)
    } : null,
    bestMoodType: bestMoodType.type !== 'none' ? {
      type: bestMoodType.type,
      percent: bestMoodType.value.toFixed(0)
    } : null,
    worstMoodType: worstMoodType.type !== 'none' ? {
      type: worstMoodType.type,
      percent: worstMoodType.value.toFixed(0)
    } : null,
    typeStats
  }
})

// Get most recent completed activities
const recentActivities = computed(() => {
  return activityStore.getCompletedActivities()
    .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
    .slice(0, 5)
})

// Format date for display
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
}
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
      <div class="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 p-4 rounded-md border border-blue-100 dark:border-blue-800">
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
    
    <!-- Stats toggle button -->
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
    
    <!-- Statistics Card -->
    <Card v-if="showStats">
      <CardHeader>
        <CardTitle>Activity Statistics</CardTitle>
        <CardDescription>
          Insights based on {{ stats.totalWithFeedback }} activities with feedback
        </CardDescription>
        
        <!-- Stats navigation tabs -->
        <div class="flex space-x-1 mt-2 border-b dark:border-gray-700">
          <button 
            @click="activeTab = 'overview'" 
            class="py-2 px-3 text-sm focus:outline-none"
            :class="activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
          >
            Overview
          </button>
          <button 
            @click="activeTab = 'activities'" 
            class="py-2 px-3 text-sm focus:outline-none"
            :class="activeTab === 'activities' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
          >
            Recent Activities
          </button>
        </div>
      </CardHeader>
      
      <!-- Overview Tab with 2-column layout -->
      <CardContent v-if="activeTab === 'overview'">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <div class="text-xs text-gray-500 dark:text-gray-400">Activities Completed</div>
            <div class="text-2xl font-semibold mt-1">{{ stats.totalCompleted }}</div>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <div class="text-xs text-gray-500 dark:text-gray-400">Upcoming Activities</div>
            <div class="text-2xl font-semibold mt-1">{{ stats.totalUpcoming }}</div>
          </div>
        </div>
        
        <!-- 2-column layout for stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Left column: Key metrics -->
          <div class="space-y-4">
            <div class="flex flex-col gap-1">
              <div class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">Prediction Accuracy</span>
                <span class="font-medium" :class="Number(stats.predictionAccuracy) > 70 ? 'text-green-500' : Number(stats.predictionAccuracy) < 50 ? 'text-red-500' : 'text-yellow-500'">
                  {{ stats.predictionAccuracy }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div class="bg-blue-600 h-2 rounded-full" :style="`width: ${stats.predictionAccuracy}%`"></div>
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <div class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">Difficulty Accuracy</span>
                <span class="font-medium" :class="Number(stats.avgDifficultyDiffPercent) > 0 ? 'text-green-500' : Number(stats.avgDifficultyDiffPercent) < 0 ? 'text-red-500' : ''">
                  {{ Number(stats.avgDifficultyDiffPercent) > 0 ? " +" + stats.avgDifficultyDiffPercent + '% easier than expected' : Number(stats.avgDifficultyDiffPercent) < 0 ? Math.abs(Number(stats.avgDifficultyDiffPercent)) + '% harder than expected' : 'As expected' }}
                </span>
              </div>
              
              <!-- Difficulty comparison slider -->
              <div class="relative h-5">
                <!-- Expected difficulty background -->
                <div class="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

                <!-- Expected difficulty value -->
                <div class="absolute inset-y-0 left-0 rounded-full"
                     :class="Number(stats.avgDifficultyDiffPercent) > 0 ? 'bg-green-400 dark:bg-green-600' : 'bg-red-400 dark:bg-red-600'"
                :style="`width: ${Number(stats.avgExpectedDifficulty) * 10}%`"></div>

                <!-- Actual difficulty value -->
                <div class="absolute inset-y-0 left-0 rounded-full bg-blue-500 dark:bg-blue-600"
                     :style="`width: ${Number(stats.avgActualDifficulty) * 10}%`"></div>

                <!-- Labels -->
                <div class="absolute inset-0 flex justify-between items-center px-2 text-xs text-white font-medium">
                  <span>Easier</span>
                  <span>Harder</span>
                </div>
              </div>
              
              <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Expected: {{ stats.avgExpectedDifficulty }}/10</span>
                <span>Actual: {{ stats.avgActualDifficulty }}/10</span>
              </div>
            </div>
            
            <div class="flex flex-col gap-1">
              <div class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">Mood Impact</span>
                <span class="font-medium" :class="Number(stats.avgMoodImprovementPercent) > 0 ? 'text-green-500' : Number(stats.avgMoodImprovementPercent) < 0 ? 'text-red-500' : ''">
                  {{ Number(stats.avgMoodImprovementPercent) > 0 ? " +" + stats.avgMoodImprovementPercent + '% better than expected' : Number(stats.avgMoodImprovementPercent) < 0 ? Math.abs(Number(stats.avgMoodImprovementPercent)) + '% worse than expected' : 'As expected' }}
                </span>
              </div>
              
              <!-- Mood comparison slider -->
              <div class="relative h-5">
                <!-- Expected mood background -->
                <div class="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                
                <!-- Actual mood value (below) -->
                <div class="absolute inset-y-0 left-0 rounded-full"
                     :class="Number(stats.avgMoodImprovementPercent) > 0 ? 'bg-green-400 dark:bg-green-600' : 'bg-red-400 dark:bg-red-600'"
                     :style="`width: ${Number(stats.avgActualMood) * 10}%`"></div>
                
                <!-- Expected mood value (on top with transparency) -->
                <div class="absolute inset-y-0 left-0 bg-blue-500 dark:bg-blue-600 rounded-full"
                     :style="`width: ${Number(stats.avgExpectedMood) * 10}%`"></div>
                
                <!-- Labels -->
                <div class="absolute inset-0 flex justify-between items-center px-2 text-xs text-white font-medium">
                  <span>Lower</span>
                  <span>Higher</span>
                </div>
              </div>
              
              <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Expected: {{ stats.avgExpectedMood }}/10</span>
                <span>Actual: {{ stats.avgActualMood }}/10</span>
              </div>
            </div>
            
            <div class="flex flex-col gap-1">
              <div class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">Most Common Activity Type</span>
                <span class="font-medium capitalize">
                  {{ stats.mostCommonType === 'self-care' ? 'Self-Care' : 
                     stats.mostCommonType === 'cooking' ? 'Cooking' :
                     stats.mostCommonType === 'shopping' ? 'Shopping' :
                     stats.mostCommonType === 'chores' ? 'Chores' : 
                     stats.mostCommonType }} ({{ stats.activityTypeCount }})
                </span>
              </div>
            </div>
            
            <!-- Activity Type Insights Summary -->
            <div v-if="stats.bestMoodType" class="flex flex-col gap-1 pt-2 mt-2 border-t dark:border-gray-700">
              <div class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">Best Activity for Mood</span>
                <span class="font-medium capitalize text-green-600 dark:text-green-400">
                  {{ stats.bestMoodType.type === 'self-care' ? 'Self-Care' : 
                     stats.bestMoodType.type === 'cooking' ? 'Cooking' :
                     stats.bestMoodType.type === 'shopping' ? 'Shopping' :
                     stats.bestMoodType.type === 'chores' ? 'Chores' : 
                     stats.bestMoodType.type }}
                </span>
              </div>
              <div class="text-xs text-muted-foreground italic">
                Improves mood by {{ stats.bestMoodType.percent }}% more than expected
              </div>
            </div>
          </div>
          
          <!-- Right column: Trends and detailed stats -->
          <div class="space-y-4">
            <!-- Activity Type Insights -->
            <div v-if="stats.easiestType || stats.hardestType || stats.bestMoodType || stats.worstMoodType">
              <div class="text-sm font-medium mb-2">Activity Expectations vs Actual Insights</div>
              <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-md space-y-3">
                <!-- Easiest Activity Type -->
                <div v-if="stats.easiestType" class="border-b pb-2 dark:border-gray-700">
                  <div class="text-xs font-medium text-green-600 dark:text-green-400">Difficulty</div>
                  <div class="flex justify-between items-center mt-1">
                    <div class="text-sm capitalize">
                      {{ stats.easiestType.type === 'self-care' ? 'Self-Care' : 
                         stats.easiestType.type === 'cooking' ? 'Cooking' :
                         stats.easiestType.type === 'shopping' ? 'Shopping' :
                         stats.easiestType.type === 'chores' ? 'Chores' : 
                         stats.easiestType.type }}
                    </div>
                    <div class="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-50 dark:text-green-300 px-2 py-0.5 rounded-full">
                      +{{ stats.easiestType.percent }}% easier than expected
                    </div>
                  </div>
                </div>
                
                <!-- Best Mood Activity Type -->
                <div v-if="stats.bestMoodType" class="dark:border-gray-700">
                  <div class="text-xs font-medium text-green-600 dark:text-green-400">Mood</div>
                  <div class="flex justify-between items-center mt-1">
                    <div class="text-sm capitalize">
                      {{ stats.bestMoodType.type === 'self-care' ? 'Self-Care' : 
                         stats.bestMoodType.type === 'cooking' ? 'Cooking' :
                         stats.bestMoodType.type === 'shopping' ? 'Shopping' :
                         stats.bestMoodType.type === 'chores' ? 'Chores' : 
                         stats.bestMoodType.type }}
                    </div>
                    <div class="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-50 dark:text-green-300 px-2 py-0.5 rounded-full">
                      +{{ stats.bestMoodType.percent }}% better mood than expected
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            <!-- Mood vs. Difficulty Correlation -->
            <div>
              <div class="text-sm font-medium mb-2">Mood vs. Difficulty Correlation</div>
              <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Activities that are easier than expected tend to improve mood by
                  <span class="font-medium" :class="Number(stats.avgMoodImprovementPercent) > 0 ? 'text-green-500' : 'text-red-500'">
                    {{ Number(stats.avgMoodImprovementPercent) > 0 ? stats.avgMoodImprovementPercent + '%' : Math.abs(Number(stats.avgMoodImprovementPercent)) + '%' }}
                  </span> on average.
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Recommendation: Focus on activities that you find easier than expected to improve your mood.
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <!-- Recent Activities Tab -->
      <CardContent v-if="activeTab === 'activities'" class="p-0">
        <div class="divide-y dark:divide-gray-700">
          <div v-for="activity in recentActivities" :key="activity.id" class="p-4">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-medium">{{ activity.activityName }}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(activity.endTime) }}</p>
              </div>
              <div class="flex space-x-2">
                <div v-if="activity.actualMood" class="flex flex-col items-center">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Mood</span>
                  <span class="font-medium" :class="activity.actualMood > activity.expectedMood ? 'text-green-500' : activity.actualMood < activity.expectedMood ? 'text-red-500' : ''">
                    {{ activity.actualMood }}/10
                  </span>
                </div>
                <div v-if="activity.actualDifficulty" class="flex flex-col items-center">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Difficulty</span>
                  <span class="font-medium" :class="activity.actualDifficulty < activity.expectedDifficulty ? 'text-green-500' : activity.actualDifficulty > activity.expectedDifficulty ? 'text-red-500' : ''">
                    {{ activity.actualDifficulty }}/10
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="recentActivities.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
          No completed activities with feedback yet
        </div>
      </CardContent>
      
      
      <CardFooter class="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-2">
        <span>Based on data from {{ stats.totalWithFeedback }} activities</span>
        <span>Updated {{ new Date().toLocaleDateString() }}</span>
      </CardFooter>
    </Card>
  </div>
</template>
