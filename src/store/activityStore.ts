import { ref, reactive, inject, provide, InjectionKey } from 'vue'
import { ActivityType, ACTIVITY_TYPES } from '../types/activityTypes'

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
  activityType: ActivityType
  createdAt: Date
  completed: boolean
}

export interface ActivityStore {
  activities: Activity[]
  addActivity: (activity: Activity) => Activity
  getActivities: () => Activity[]
  getActivityById: (id: string) => Activity | undefined
  updateActivity: (id: string, updates: Partial<Activity>) => Activity | null
  deleteActivity: (id: string) => boolean
  getPendingFeedbackActivities: () => Activity[]
  getCompletedActivities: () => Activity[]
  getUpcomingActivities: () => Activity[]
}

// Create a symbol for injection key
export const ActivityStoreKey: InjectionKey<ActivityStore> = Symbol('ActivityStore')

// Create and export the provider function
export function createActivityStore() {
  // State
  const activities = ref<Activity[]>([])

  // Load from localStorage if available
  const loadFromStorage = () => {
    try {
      const storedActivities = localStorage.getItem('activities')
      if (storedActivities) {
        // Parse the JSON and convert string dates back to Date objects
        const parsed = JSON.parse(storedActivities)
        activities.value = parsed.map((activity: any) => ({
          ...activity,
          startTime: new Date(activity.startTime),
          endTime: new Date(activity.endTime),
          createdAt: new Date(activity.createdAt)
        }))
      }
    } catch (error) {
      console.error('Failed to load activities from localStorage:', error)
    }
  }

  // Save to localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem('activities', JSON.stringify(activities.value))
    } catch (error) {
      console.error('Failed to save activities to localStorage:', error)
    }
  }

  // Initialize from storage
  loadFromStorage()

  // Store functions
  const addActivity = (activity: Activity) => {
    activities.value.push(activity)
    saveToStorage()
    console.log('Activity added to store:', activity)
    return activity
  }

  const getActivities = () => {
    return activities.value
  }

  const getActivityById = (id: string) => {
    return activities.value.find(activity => activity.id === id)
  }

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    const index = activities.value.findIndex(activity => activity.id === id)
    if (index !== -1) {
      activities.value[index] = { ...activities.value[index], ...updates }
      saveToStorage()
      return activities.value[index]
    }
    return null
  }

  const deleteActivity = (id: string) => {
    const index = activities.value.findIndex(activity => activity.id === id)
    if (index !== -1) {
      activities.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }

  // Helper functions for filtering activities
  const getPendingFeedbackActivities = () => {
    const now = new Date()
    return activities.value.filter(activity => 
      !activity.completed && 
      activity.endTime < now && 
      activity.actualDifficulty === undefined
    )
  }

  const getCompletedActivities = () => {
    return activities.value.filter(activity => activity.completed)
  }

  const getUpcomingActivities = () => {
    const now = new Date()
    return activities.value.filter(activity => 
      !activity.completed && 
      activity.startTime > now
    )
  }

  // Create the store object
  const store: ActivityStore = {
    activities: activities.value,
    addActivity,
    getActivities,
    getActivityById,
    updateActivity,
    deleteActivity,
    getPendingFeedbackActivities,
    getCompletedActivities,
    getUpcomingActivities
  }

  return store
}

// Use this function to get the store in any component
export function useActivityStore() {
  const store = inject(ActivityStoreKey)
  if (!store) {
    throw new Error('Activity store not provided')
  }
  return store
}
