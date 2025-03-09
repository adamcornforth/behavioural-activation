<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import Modal from './ui/modal.vue'
import Button from './ui/button.vue'
import { getPresetsByCategory, findPresetById } from '../data/activityPresets'
import { Activity } from '../store/activityStore'
import { getActivityTypeOptions } from '../types/activityTypes'

const props = defineProps<{
  open: boolean
  startTime?: Date
  endTime?: Date
  editActivity?: Activity
  provideFeedback?: boolean
}>()

const emit = defineEmits(['close', 'submit'])

// Activity presets
const presetsByCategory = computed(() => getPresetsByCategory())
const selectedCategory = ref('')
const selectedPresetId = ref('')


// UI state
const showAdvancedFields = ref(false)
const activeTab = ref<'edit' | 'feedback'>('edit')

// Form state
const formData = reactive({
  activityName: '',
  expectedDifficulty: 5,
  expectedMood: 5,
  actualDifficulty: undefined as number | undefined,
  actualMood: undefined as number | undefined,
  // Advanced fields
  location: '',
  notes: '',
  participants: '',
  activityType: 'other'
})

// Reset form function
const resetForm = () => {
  formData.activityName = ''
  formData.expectedDifficulty = 5
  formData.expectedMood = 5
  formData.location = ''
  formData.notes = ''
  formData.participants = ''
  formData.activityType = 'other'
  showAdvancedFields.value = false
  selectedCategory.value = ''
  selectedPresetId.value = ''
  activeTab.value = 'edit'
}

// Apply selected preset to form
const applyPreset = () => {
  if (!selectedPresetId.value) return
  
  const preset = findPresetById(selectedPresetId.value)
  if (!preset) return
  
  // Apply preset values to form
  formData.activityName = preset.name
  formData.expectedDifficulty = preset.expectedDifficulty
  formData.expectedMood = preset.expectedMood
  formData.activityType = preset.category.toLowerCase()
  
  // Set location if provided in preset
  if (preset.location) {
    formData.location = preset.location
  }
  
  // If we have advanced fields with data, show them
  if (preset.location) {
    showAdvancedFields.value = true
  }
}

// Watch for edit activity changes
import { watch } from 'vue'

watch(() => props.editActivity, (newVal) => {
  if (newVal) {
    // Populate form with activity data
    formData.activityName = newVal.activityName
    formData.expectedDifficulty = newVal.expectedDifficulty
    formData.expectedMood = newVal.expectedMood
    formData.actualDifficulty = newVal.actualDifficulty
    formData.actualMood = newVal.actualMood
    formData.location = newVal.location || ''
    formData.notes = newVal.notes || ''
    formData.participants = newVal.participants || ''
    formData.activityType = newVal.activityType || 'other'
    
    // Reset preset selections
    selectedCategory.value = ''
    selectedPresetId.value = ''
    
    // Don't automatically show advanced fields even if they have data
    showAdvancedFields.value = false
    
    // Set active tab based on provideFeedback prop
    if (props.provideFeedback) {
      activeTab.value = 'feedback'
    } else {
      activeTab.value = 'edit'
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Reset presets when modal opens/closes
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    selectedCategory.value = ''
    selectedPresetId.value = ''
  }
})

// Watch for provideFeedback prop changes
watch(() => props.provideFeedback, (newVal) => {
  if (newVal) {
    activeTab.value = 'feedback'
  } else {
    activeTab.value = 'edit'
  }
})

// Initialize with feedback tab if provideFeedback is true
if (props.provideFeedback) {
  activeTab.value = 'feedback'
}


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

import { getActivityTypeOptions } from '../types/activityTypes'
const activityTypes = getActivityTypeOptions()

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
    // Check if feedback was provided
    if (formData.actualDifficulty !== undefined && formData.actualMood !== undefined) {
      activity.completed = true
    }
    console.log('Activity updated:', activity)
  }
  
  emit('submit', activity)
  resetForm()
}

// Handle feedback submission
const handleFeedbackSubmit = () => {
  if (!props.editActivity) return
  
  // Create activity object with feedback data
  const activity = {
    ...props.editActivity,
    actualDifficulty: formData.actualDifficulty,
    actualMood: formData.actualMood,
    completed: true
  }
  
  emit('submit', activity)
  resetForm()
}

// Clear feedback data
const clearFeedback = () => {
  if (!props.editActivity) return
  
  // Create activity object with cleared feedback data
  const activity = {
    ...props.editActivity,
    actualDifficulty: undefined,
    actualMood: undefined,
    completed: false
  }
  
  emit('submit', activity)
  
  // Reset form fields related to feedback
  formData.actualDifficulty = undefined
  formData.actualMood = undefined
}


// Computed properties for feedback comparison
const getDifficultyDifference = computed(() => {
  if (!props.editActivity || formData.actualDifficulty === undefined) return '';
  
  const diff = formData.actualDifficulty - props.editActivity.expectedDifficulty;
  if (diff === 0) return 'same';
  return diff > 0 ? `+${diff}` : `${diff}`;
});

const getDifficultyComparisonClass = computed(() => {
  if (!props.editActivity || formData.actualDifficulty === undefined) return '';
  
  const diff = formData.actualDifficulty - props.editActivity.expectedDifficulty;
  if (diff === 0) return 'text-gray-500 dark:text-gray-400';
  return diff > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400';
});

const getMoodDifference = computed(() => {
  if (!props.editActivity || formData.actualMood === undefined) return '';
  
  const diff = formData.actualMood - props.editActivity.expectedMood;
  if (diff === 0) return 'same';
  return diff > 0 ? `+${diff}` : `${diff}`;
});

const getMoodComparisonClass = computed(() => {
  if (!props.editActivity || formData.actualMood === undefined) return '';
  
  const diff = formData.actualMood - props.editActivity.expectedMood;
  if (diff === 0) return 'text-gray-500 dark:text-gray-400';
  return diff > 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';
});

// Handle modal close
const handleClose = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <Modal 
    :open="open" 
    :title="editActivity ? (activeTab === 'feedback' ? 'Provide Feedback' : 'Edit Activity') : 'Create New Activity'"
    :description="activeTab === 'feedback' ? 'How did this activity affect you?' : 'Plan your activity and predict how it will affect you'"
    @close="handleClose"
    size="lg"
    class="overflow-hidden"
  >
    <!-- Content wrapper with scrolling -->
    <div class="overflow-y-auto max-h-[60vh] pr-1 -mr-1">
    
    <!-- Tab navigation -->
    <div v-if="editActivity" class="mb-4 border-b dark:border-gray-700">
      <div class="flex space-x-4">
        <button 
          @click="activeTab = 'edit'" 
          class="py-2 px-4 font-medium text-sm focus:outline-none"
          :class="activeTab === 'edit' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
        >
          Edit Details
        </button>
        <button 
          @click="activeTab = 'feedback'" 
          class="py-2 px-4 font-medium text-sm focus:outline-none"
          :class="activeTab === 'feedback' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
        >
          Provide Feedback
        </button>
      </div>
    </div>
    <!-- Edit tab -->
    <form v-if="activeTab === 'edit'" @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Time information -->
      <div v-if="startTime && endTime" class="bg-gray-50 dark:bg-gray-700 p-3 rounded-md mb-4">
        <p class="text-sm font-medium dark:text-gray-200">Selected Time:</p>
        <p class="text-sm dark:text-gray-300">{{ formatDateTime(startTime) }} - {{ formatDateTime(endTime) }}</p>
      </div>
      
      <!-- Activity Presets - only show when creating a new activity -->
      <div v-if="!editActivity" class="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
        <p class="text-sm font-medium mb-2 dark:text-gray-200">Quick Add from Presets:</p>
        <div class="grid grid-cols-2 gap-2">
          <select 
            v-model="selectedCategory" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="">Select Category</option>
            <option v-for="category in Object.keys(presetsByCategory)" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          
          <select 
            v-model="selectedPresetId" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            :disabled="!selectedCategory"
            @change="applyPreset"
          >
            <option value="">Select Activity</option>
            <option 
              v-for="preset in selectedCategory ? presetsByCategory[selectedCategory] : []" 
              :key="preset.id" 
              :value="preset.id"
            >
              {{ preset.name }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Basic fields - more compact spacing -->
      <div class="space-y-3">
        <div>
          <label for="activityName" class="block text-sm font-medium mb-1 dark:text-gray-200">Activity Name*</label>
          <input 
            id="activityName" 
            v-model="formData.activityName" 
            type="text" 
            required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            placeholder="What are you planning to do?"
          />
        </div>
        
        <div>
          <label for="expectedDifficulty" class="block text-sm font-medium mb-1 dark:text-gray-200">
            Expected Difficulty: {{ formData.expectedDifficulty }}
          </label>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">Very Easy</span>
            <input 
              id="expectedDifficulty" 
              v-model="formData.expectedDifficulty" 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span class="text-xs text-gray-500 dark:text-gray-400">Very Difficult</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">How difficult do you expect this activity to be?</p>
        </div>
        
        <div>
          <label for="expectedMood" class="block text-sm font-medium mb-1 dark:text-gray-200">
            Expected Mood Impact: {{ formData.expectedMood }}
          </label>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">Very Low</span>
            <input 
              id="expectedMood" 
              v-model="formData.expectedMood" 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span class="text-xs text-gray-500 dark:text-gray-400">Excellent</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">How do you expect this activity to affect your mood?</p>
        </div>
      </div>
      
      <!-- Toggle for advanced fields -->
      <div>
        <button 
          type="button" 
          @click="showAdvancedFields = !showAdvancedFields"
          class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
        >
          {{ showAdvancedFields ? 'Hide' : 'Show' }} advanced fields
          <span class="ml-1">{{ showAdvancedFields ? '▲' : '▼' }}</span>
        </button>
      </div>
      
      <!-- Advanced fields - more compact spacing -->
      <div v-if="showAdvancedFields" class="space-y-3 border-t dark:border-gray-700 pt-3 mt-2">
        <div>
          <label for="activityType" class="block text-sm font-medium mb-1 dark:text-gray-200">Activity Type</label>
          <select 
            id="activityType" 
            v-model="formData.activityType" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
          >
            <option v-for="type in activityTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>
        
        <div>
          <label for="location" class="block text-sm font-medium mb-1 dark:text-gray-200">Location</label>
          <input 
            id="location" 
            v-model="formData.location" 
            type="text" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            placeholder="Where will this activity take place?"
          />
        </div>
        
        <div>
          <label for="participants" class="block text-sm font-medium mb-1 dark:text-gray-200">Participants</label>
          <input 
            id="participants" 
            v-model="formData.participants" 
            type="text" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            placeholder="Who will be involved? (e.g., 'Alone', 'With friends')"
          />
        </div>
        
        <div>
          <label for="notes" class="block text-sm font-medium mb-1 dark:text-gray-200">Notes</label>
          <textarea 
            id="notes" 
            v-model="formData.notes" 
            rows="2" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            placeholder="Any additional details or thoughts..."
          ></textarea>
        </div>
      </div>
    </form>
    
    <!-- Feedback tab -->
    <form v-if="activeTab === 'feedback' && editActivity" @submit.prevent="handleFeedbackSubmit" class="space-y-4">
      <!-- Activity info -->
      <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-md mb-4">
        <h3 class="font-medium mb-2 dark:text-gray-200">{{ editActivity.activityName }}</h3>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p class="text-gray-500 dark:text-gray-400">Expected Difficulty:</p>
            <p class="dark:text-gray-300">{{ editActivity.expectedDifficulty }}/10</p>
          </div>
          <div>
            <p class="text-gray-500 dark:text-gray-400">Expected Mood:</p>
            <p class="dark:text-gray-300">{{ editActivity.expectedMood }}/10</p>
          </div>
        </div>
      </div>
      
      <!-- Feedback fields - more compact spacing -->
      <div class="space-y-3">
        <div>
          <label for="actualDifficulty" class="block text-sm font-medium mb-1 dark:text-gray-200">
            Actual Difficulty: {{ formData.actualDifficulty || '?' }}
            <span v-if="formData.actualDifficulty && editActivity" 
                  :class="getDifficultyComparisonClass">
              ({{ getDifficultyDifference }})
            </span>
          </label>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">Very Easy</span>
            <input 
              id="actualDifficulty" 
              v-model="formData.actualDifficulty" 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              required
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span class="text-xs text-gray-500 dark:text-gray-400">Very Difficult</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">How difficult was this activity actually?</p>
        </div>
        
        <div>
          <label for="actualMood" class="block text-sm font-medium mb-1 dark:text-gray-200">
            Actual Mood Impact: {{ formData.actualMood || '?' }}
            <span v-if="formData.actualMood && editActivity" 
                  :class="getMoodComparisonClass">
              ({{ getMoodDifference }})
            </span>
          </label>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">Very Low</span>
            <input 
              id="actualMood" 
              v-model="formData.actualMood" 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              required
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span class="text-xs text-gray-500 dark:text-gray-400">Excellent</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">How did this activity actually affect your mood?</p>
        </div>
        
        <div>
          <label for="feedbackNotes" class="block text-sm font-medium mb-1 dark:text-gray-200">Reflection Notes</label>
          <textarea 
            id="feedbackNotes" 
            v-model="formData.notes" 
            rows="2" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            placeholder="Any reflections on this activity..."
          ></textarea>
        </div>
      </div>
    </form>
    
    </div> <!-- Close the scrollable content wrapper -->
    
    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button @click="handleClose" variant="outline" class="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</Button>
        <Button 
          v-if="activeTab === 'edit'" 
          @click="handleSubmit" 
          :disabled="!formData.activityName"
        >
          {{ editActivity ? 'Update Activity' : 'Create Activity' }}
        </Button>
        <Button 
          v-if="activeTab === 'feedback' && editActivity?.actualDifficulty !== undefined && editActivity?.actualMood !== undefined" 
          @click="clearFeedback" 
          variant="destructive"
        >
          Clear Feedback
        </Button>
        <Button 
          v-if="activeTab === 'feedback'" 
          @click="handleFeedbackSubmit" 
          :disabled="formData.actualDifficulty === undefined || formData.actualMood === undefined"
        >
          Submit Feedback
        </Button>
      </div>
    </template>
  </Modal>
</template>
