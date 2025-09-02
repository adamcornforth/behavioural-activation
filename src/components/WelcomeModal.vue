<template>
  <Modal 
    :open="open" 
    @close="$emit('close')"
    title="Welcome to Behavioural Activation"
    size="lg"
  >
    <div class="space-y-6">
      <div class="text-center">
        <div class="mb-4 flex justify-center">
          <div class="rounded-full bg-blue-100 dark:bg-blue-900 p-3">
            <svg class="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Start Your Journey to Better Mental Wellbeing
        </h3>
        <p class="text-gray-600 dark:text-gray-300 text-sm">
          This app helps you plan, track, and reflect on meaningful activities to improve your mood and engagement with life.
        </p>
      </div>

      <div class="space-y-4">
        <div class="border-l-4 border-blue-500 pl-4">
          <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-1">📅 Plan Activities</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Click on the calendar to schedule activities. Set your expected difficulty and mood impact.
          </p>
        </div>

        <div class="border-l-4 border-green-500 pl-4">
          <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-1">📊 Track Progress</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            After completing activities, provide feedback on actual difficulty and mood impact to build insights.
          </p>
        </div>

        <div class="border-l-4 border-purple-500 pl-4">
          <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-1">📈 View Statistics</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Monitor your progress with mood and difficulty trends, activity completion rates, and insights.
          </p>
        </div>

        <div class="border-l-4 border-orange-500 pl-4">
          <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-1">🎨 Activity Types</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Choose from different activity categories: Self-care, Exercise, Social, Creative, Outdoor, and more.
          </p>
        </div>
      </div>

      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-blue-800 dark:text-blue-200">
              Sample Data Included
            </p>
            <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
              We've added some sample activities to help you get started. Feel free to modify or delete them as you begin using the app.
            </p>
          </div>
        </div>
      </div>

      <div class="text-center pt-4">
        <button
          @click="$emit('close')"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Get Started
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './ui/modal.vue'

defineProps<{
  open: boolean
}>()

defineEmits(['close'])
</script>