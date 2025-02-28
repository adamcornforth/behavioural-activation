import { ref, reactive } from 'vue'

export interface Activity {
  id: string
  activityName: string
  startTime: Date
  endTime: Date
  expectedDifficulty: number
  expectedMood: number
  actualDifficulty?: number
  actualMood?: number
  location?: string
  notes?: string
  participants?: string
  activityType: string
  createdAt: Date
  completed: boolean
}

// Create a reactive store
const activities = ref<Activity[]>([])

// Store functions
export function addActivity(activity: Activity) {
  activities.value.push(activity)
  console.log('Activity added to store:', activity)
  console.log('Current activities:', activities.value)
  return activity
}

export function getActivities() {
  return activities.value
}

export function getActivityById(id: string) {
  return activities.value.find(activity => activity.id === id)
}

export function updateActivity(id: string, updates: Partial<Activity>) {
  const index = activities.value.findIndex(activity => activity.id === id)
  if (index !== -1) {
    activities.value[index] = { ...activities.value[index], ...updates }
    return activities.value[index]
  }
  return null
}

export function deleteActivity(id: string) {
  const index = activities.value.findIndex(activity => activity.id === id)
  if (index !== -1) {
    activities.value.splice(index, 1)
    return true
  }
  return false
}
