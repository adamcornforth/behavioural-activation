<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Card from '../components/ui/card.vue'
import CardHeader from '../components/ui/card-header.vue'
import CardTitle from '../components/ui/card-title.vue'
import CardDescription from '../components/ui/card-description.vue'
import CardContent from '../components/ui/card-content.vue'
import CardFooter from '../components/ui/card-footer.vue'
import Button from '../components/ui/button.vue'
import Calendar from '../components/Calendar.vue'
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
