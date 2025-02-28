<script setup lang="ts">
import { ref, computed } from 'vue'
import Modal from './ui/modal.vue'
import Button from './ui/button.vue'

const props = defineProps<{
  open: boolean
  activity?: any
}>()

const emit = defineEmits(['close', 'submit'])

// Form state
const actualDifficulty = ref(5)
const actualMood = ref(5)
const skipFeedback = ref(false)

// Reset when activity changes
import { watch } from 'vue'
watch(() => props.activity, (newActivity) => {
  if (newActivity) {
    // Initialize with expected values if available
    actualDifficulty.value = newActivity.expectedDifficulty || 5
    actualMood.value = newActivity.expectedMood || 5
    skipFeedback.value = false
  }
}, { immediate: true })

// Difficulty and mood options
const difficultyOptions = [
  { value: 1, label: 'Very Easy' },
  { value: 3, label: 'Easy' },
  { value: 5, label: 'Moderate' },
  { value: 7, label: 'Difficult' },
  { value: 10, label: 'Very Difficult' }
]

const moodOptions = [
  { value: 1, label: 'Very Low' },
  { value: 3, label: 'Low' },
  { value: 5, label: 'Neutral' },
  { value: 7, label: 'Good' },
  { value: 10, label: 'Excellent' }
]

// Format date for display
const formatDateTime = (date?: Date) => {
  if (!date) return ''
  return date.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Activity time info
const activityTimeInfo = computed(() => {
  if (!props.activity) return ''
  
  const start = formatDateTime(props.activity.startTime)
  const end = formatDateTime(props.activity.endTime)
  return `${start} - ${end}`
})

// Handle form submission
const handleSubmit = () => {
  if (!props.activity) return
  
  const feedback = {
    id: props.activity.id,
    actualDifficulty: skipFeedback.value ? undefined : actualDifficulty.value,
    actualMood: skipFeedback.value ? undefined : actualMood.value,
    completed: true
  }
  
  emit('submit', feedback)
}

// Handle modal close
const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Modal 
    :open="open" 
    title="Activity Feedback" 
    description="How did this activity go for you?"
    @close="handleClose"
    size="md"
  >
    <div v-if="activity" class="space-y-4">
      <!-- Activity info -->
      <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-md mb-4">
        <p class="text-sm font-medium dark:text-gray-200">{{ activity.activityName }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ activityTimeInfo }}</p>
      </div>
      
      <!-- Skip feedback option -->
      <div class="flex items-center mb-4">
        <input 
          id="skipFeedback" 
          v-model="skipFeedback" 
          type="checkbox" 
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
        />
        <label for="skipFeedback" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Skip providing feedback for this activity
        </label>
      </div>
      
      <!-- Feedback form -->
      <form v-if="!skipFeedback" @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="actualDifficulty" class="block text-sm font-medium mb-1 dark:text-gray-200">
            Actual Difficulty
          </label>
          <div class="flex items-center space-x-2">
            <input 
              id="actualDifficulty" 
              v-model="actualDifficulty" 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span class="text-sm font-medium w-8 text-center dark:text-gray-200">{{ actualDifficulty }}</span>
          </div>
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
            <span>Easy</span>
            <span>Difficult</span>
          </div>
        </div>
        
        <div>
          <label for="actualMood" class="block text-sm font-medium mb-1 dark:text-gray-200">
            Actual Mood Impact
          </label>
          <div class="flex items-center space-x-2">
            <input 
              id="actualMood" 
              v-model="actualMood" 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span class="text-sm font-medium w-8 text-center dark:text-gray-200">{{ actualMood }}</span>
          </div>
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
            <span>Poor</span>
            <span>Great</span>
          </div>
        </div>
        
        <!-- Expected vs Actual comparison -->
        <div v-if="activity.expectedDifficulty || activity.expectedMood" class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <p class="text-sm font-medium mb-2 dark:text-gray-200">Comparison with Expectations:</p>
          
          <div v-if="activity.expectedDifficulty" class="flex items-center text-sm mb-2">
            <span class="w-1/2 dark:text-gray-300">Expected Difficulty: {{ activity.expectedDifficulty }}</span>
            <span class="w-1/2">
              <span v-if="actualDifficulty < activity.expectedDifficulty" class="text-green-600 dark:text-green-400">
                Easier than expected (-{{ activity.expectedDifficulty - actualDifficulty }})
              </span>
              <span v-else-if="actualDifficulty > activity.expectedDifficulty" class="text-red-600 dark:text-red-400">
                Harder than expected (+{{ actualDifficulty - activity.expectedDifficulty }})
              </span>
              <span v-else class="text-gray-600 dark:text-gray-400">
                Same as expected
              </span>
            </span>
          </div>
          
          <div v-if="activity.expectedMood" class="flex items-center text-sm">
            <span class="w-1/2 dark:text-gray-300">Expected Mood: {{ activity.expectedMood }}</span>
            <span class="w-1/2">
              <span v-if="actualMood > activity.expectedMood" class="text-green-600 dark:text-green-400">
                Better than expected (+{{ actualMood - activity.expectedMood }})
              </span>
              <span v-else-if="actualMood < activity.expectedMood" class="text-red-600 dark:text-red-400">
                Worse than expected (-{{ activity.expectedMood - actualMood }})
              </span>
              <span v-else class="text-gray-600 dark:text-gray-400">
                Same as expected
              </span>
            </span>
          </div>
        </div>
      </form>
    </div>
    
    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button @click="handleClose" variant="outline" class="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</Button>
        <Button @click="handleSubmit">
          {{ skipFeedback ? 'Skip Feedback' : 'Submit Feedback' }}
        </Button>
      </div>
    </template>
  </Modal>
</template>
