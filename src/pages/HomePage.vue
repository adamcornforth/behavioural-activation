<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Card from '../components/ui/card.vue'
import CardHeader from '../components/ui/card-header.vue'
import CardTitle from '../components/ui/card-title.vue'
import CardDescription from '../components/ui/card-description.vue'
import CardContent from '../components/ui/card-content.vue'
import CardFooter from '../components/ui/card-footer.vue'
import Button from '../components/ui/button.vue'
import Calendar from '../components/Calendar.vue'
import { useActivityStore, Activity } from '../store/activityStore'

// Get the activity store
const activityStore = useActivityStore()

// Get activities from the store
const activities = computed(() => activityStore.getActivities())

// Format date for display
const formatDateTime = (date: Date) => {
  return date.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div>
    <section class="mb-10">
      <h2 class="text-3xl font-bold tracking-tight mb-6">Behavioural Activation App</h2>
      <p class="text-muted-foreground text-lg mb-4">A tool to help you engage in meaningful activities</p>
    </section>
    
    <section class="mb-10">
      <div class="bg-white rounded-lg shadow-sm border p-4">
        <Calendar />
      </div>
    </section>
    
    <section class="mb-10" v-if="activities.length > 0">
      <h3 class="text-xl font-bold mb-4">Planned Activities</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card v-for="activity in activities" :key="activity.id" class="overflow-hidden">
          <CardHeader>
            <CardTitle>{{ activity.activityName }}</CardTitle>
            <CardDescription>
              {{ formatDateTime(activity.startTime) }} - {{ formatDateTime(activity.endTime) }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Expected Difficulty:</span>
                <span class="text-sm font-medium">{{ activity.expectedDifficulty }}/10</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Expected Mood Impact:</span>
                <span class="text-sm font-medium">{{ activity.expectedMood }}/10</span>
              </div>
              <div v-if="activity.activityType !== 'other'" class="flex justify-between">
                <span class="text-sm text-gray-500">Type:</span>
                <span class="text-sm font-medium capitalize">{{ activity.activityType }}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div class="flex justify-end w-full">
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
    
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Track Activities</CardTitle>
          <CardDescription>Record your daily activities and mood</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Keep a log of what you do each day and how it affects your mood. Identify patterns and make positive changes.</p>
        </CardContent>
        <CardFooter>
          <Button>Get Started</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Set Goals</CardTitle>
          <CardDescription>Create meaningful goals to work towards</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Define what matters to you and set achievable goals that align with your values and interests.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Learn More</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Monitor Progress</CardTitle>
          <CardDescription>See how your activities affect your mood over time</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Track your progress with visual charts and insights that help you understand what activities boost your wellbeing.</p>
        </CardContent>
        <CardFooter>
          <Button variant="secondary">View Demo</Button>
        </CardFooter>
      </Card>
    </section>
  </div>
</template>
