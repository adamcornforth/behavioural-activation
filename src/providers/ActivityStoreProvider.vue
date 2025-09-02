<script setup lang="ts">
import { provide } from 'vue'
import { createActivityStore, ActivityStoreKey } from '../store/activityStore'

// Create the store
const activityStore = createActivityStore()

// Provide it to all child components
provide(ActivityStoreKey, activityStore)
</script>

<template>
  <slot></slot>
</template>
