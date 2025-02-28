<script setup lang="ts">
import { ref, reactive } from 'vue'
import Modal from './ui/modal.vue'
import Button from './ui/button.vue'

const props = defineProps<{
  open: boolean
  startTime?: Date
  endTime?: Date
  editActivity?: any
}>()

const emit = defineEmits(['close', 'submit'])

// Reset form function (defined before it's used in the watch)
const resetForm = () => {
  formData.activityName = ''
  formData.expectedDifficulty = 5
  formData.expectedMood = 5
  formData.location = ''
  formData.notes = ''
  formData.participants = ''
  formData.activityType = 'other'
  showAdvancedFields.value = false
}

// Form state
const formData = reactive({
  activityName: '',
  expectedDifficulty: 5,
  expectedMood: 5,
  // Advanced fields
  location: '',
  notes: '',
  participants: '',
  activityType: 'other'
})

// Watch for edit activity changes
import { watch } from 'vue'

watch(() => props.editActivity, (newVal) => {
  if (newVal) {
    // Populate form with activity data
    formData.activityName = newVal.activityName
    formData.expectedDifficulty = newVal.expectedDifficulty
    formData.expectedMood = newVal.expectedMood
    formData.location = newVal.location || ''
    formData.notes = newVal.notes || ''
    formData.participants = newVal.participants || ''
    formData.activityType = newVal.activityType
    
    // Show advanced fields if they have data
    if (newVal.location || newVal.notes || newVal.participants || newVal.activityType !== 'other') {
      showAdvancedFields.value = true
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Toggle for advanced fields
const showAdvancedFields = ref(false)

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

const activityTypes = [
  { value: 'self-care', label: 'Self-Care' },
  { value: 'exercise', label: 'Exercise' },
  { value: 'social', label: 'Social' },
  { value: 'work', label: 'Work' },
  { value: 'leisure', label: 'Leisure' },
  { value: 'creative', label: 'Creative' },
  { value: 'other', label: 'Other' }
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

// Handle form submission
const handleSubmit = () => {
  if (!formData.activityName) {
    return; // Don't submit if no activity name
  }
  
  // Create activity object with all form data
  const activity = {
    ...formData,
    startTime: props.startTime,
    endTime: props.endTime
  }
  
  if (!props.editActivity) {
    // Add new activity properties
    activity.createdAt = new Date()
    activity.id = Date.now().toString()
    activity.completed = false
    console.log('Activity created:', activity)
  } else {
    console.log('Activity updated:', activity)
  }
  
  emit('submit', activity)
  resetForm()
}


// Handle modal close
const handleClose = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <Modal 
    :open="open" 
    :title="editActivity ? 'Edit Activity' : 'Create New Activity'" 
    description="Plan your activity and predict how it will affect you"
    @close="handleClose"
    size="lg"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Time information -->
      <div v-if="startTime && endTime" class="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-4">
        <p class="text-sm font-medium">Selected Time:</p>
        <p class="text-sm">{{ formatDateTime(startTime) }} - {{ formatDateTime(endTime) }}</p>
      </div>
      
      <!-- Basic fields -->
      <div class="space-y-4">
        <div>
          <label for="activityName" class="block text-sm font-medium mb-1">Activity Name*</label>
          <input 
            id="activityName" 
            v-model="formData.activityName" 
            type="text" 
            required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What are you planning to do?"
          />
        </div>
        
        <div>
          <label for="expectedDifficulty" class="block text-sm font-medium mb-1">
            Expected Difficulty*
          </label>
          <select 
            id="expectedDifficulty" 
            v-model="formData.expectedDifficulty" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in difficultyOptions" :key="option.value" :value="option.value">
              {{ option.label }} ({{ option.value }})
            </option>
          </select>
          <p class="text-xs text-gray-500 mt-1">How difficult do you expect this activity to be? (1-10)</p>
        </div>
        
        <div>
          <label for="expectedMood" class="block text-sm font-medium mb-1">
            Expected Mood Impact*
          </label>
          <select 
            id="expectedMood" 
            v-model="formData.expectedMood" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in moodOptions" :key="option.value" :value="option.value">
              {{ option.label }} ({{ option.value }})
            </option>
          </select>
          <p class="text-xs text-gray-500 mt-1">How do you expect this activity to affect your mood? (1-10)</p>
        </div>
      </div>
      
      <!-- Toggle for advanced fields -->
      <div>
        <button 
          type="button" 
          @click="showAdvancedFields = !showAdvancedFields"
          class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          {{ showAdvancedFields ? 'Hide' : 'Show' }} advanced fields
          <span class="ml-1">{{ showAdvancedFields ? '▲' : '▼' }}</span>
        </button>
      </div>
      
      <!-- Advanced fields -->
      <div v-if="showAdvancedFields" class="space-y-4 border-t pt-4 mt-2">
        <div>
          <label for="activityType" class="block text-sm font-medium mb-1">Activity Type</label>
          <select 
            id="activityType" 
            v-model="formData.activityType" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="type in activityTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>
        
        <div>
          <label for="location" class="block text-sm font-medium mb-1">Location</label>
          <input 
            id="location" 
            v-model="formData.location" 
            type="text" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Where will this activity take place?"
          />
        </div>
        
        <div>
          <label for="participants" class="block text-sm font-medium mb-1">Participants</label>
          <input 
            id="participants" 
            v-model="formData.participants" 
            type="text" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Who will be involved? (e.g., 'Alone', 'With friends')"
          />
        </div>
        
        <div>
          <label for="notes" class="block text-sm font-medium mb-1">Notes</label>
          <textarea 
            id="notes" 
            v-model="formData.notes" 
            rows="3" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any additional details or thoughts..."
          ></textarea>
        </div>
      </div>
    </form>
    
    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button @click="handleClose" variant="outline">Cancel</Button>
        <Button @click="handleSubmit" :disabled="!formData.activityName">
          {{ editActivity ? 'Update Activity' : 'Create Activity' }}
        </Button>
      </div>
    </template>
  </Modal>
</template>
