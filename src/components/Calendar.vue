<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">{{ formatDate(currentWeekStart) }}</h2>
        <div class="flex gap-2">
          <Button @click="previousWeek" variant="outline" size="sm">
            <ChevronLeft class="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button @click="currentWeek" variant="outline" size="sm">
            Today
          </Button>
          <Button @click="nextWeek" variant="outline" size="sm">
            Next
            <ChevronRight class="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      <div class="grid grid-cols-8 border-b border-gray-200">
        <div class="py-2 text-center"></div>
        <div v-for="day in weekDays" :key="day.date" class="py-2 text-center font-medium">
          <div>{{ day.name }}</div>
          <div>{{ day.date }}</div>
        </div>
      </div>
    </div>
    <div class="calendar-body grid grid-cols-8">
      <!-- Time labels -->
      <div class="time-labels">
        <div v-for="hour in hours" :key="hour" class="time-label h-20 border-b border-gray-100 text-sm text-gray-500 pr-2 text-right">
          {{ formatHour(hour) }}
        </div>
      </div>
      
      <!-- Calendar grid -->
      <template v-for="day in 7" :key="day">
        <div class="day-column">
          <div 
            v-for="hour in hours" 
            :key="hour" 
            class="hour-cell h-20 border-b border-r border-gray-100"
            @mousedown="startDrag($event, day - 1, hour)"
            @mousemove="onDrag($event, day - 1, hour)"
            @mouseup="endDrag()"
            @mouseleave="onMouseLeave($event, day - 1, hour)"
          >
            <!-- Visual selection indicator -->
            <div 
              v-if="isDragging && isInSelectionRange(day - 1, hour)" 
              class="bg-blue-100 border border-blue-300 rounded-sm h-full w-full absolute inset-0 opacity-70"
            ></div>
          </div>
        </div>
      </template>
      
      <!-- Selection preview -->
      <div v-if="isDragging" class="selection-preview fixed bottom-4 right-4 bg-white p-3 shadow-lg rounded-md border border-gray-200 z-50">
        <p class="font-medium">Selection:</p>
        <p>{{ formatSelectionTime() }}</p>
      </div>
    </div>
    
    <!-- Activity creation modal -->
    <ActivityModal 
      :open="showActivityModal" 
      :start-time="selectedTimeRange?.start" 
      :end-time="selectedTimeRange?.end"
      @close="showActivityModal = false"
      @submit="handleActivitySubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import Button from './ui/button.vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import ActivityModal from './ActivityModal.vue';

// State
const currentWeekStart = ref(startOfWeek(new Date(), { weekStartsOn: 1 })); // Start on Monday
const isDragging = ref(false);
const dragStartDay = ref(0);
const dragStartHour = ref(0);
const dragEndDay = ref(0);
const dragEndHour = ref(0);

// Activity modal state
const showActivityModal = ref(false);
const selectedTimeRange = ref<{ start: Date, end: Date } | null>(null);

// Hours for the day (6 AM to 10 PM)
const hours = Array.from({ length: 17 }, (_, i) => i + 6);

// Computed properties
const weekDays = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeekStart.value, i);
    return {
      name: format(date, 'EEE'),
      date: format(date, 'd'),
      fullDate: date
    };
  });
});

// Methods
const formatDate = (date: Date) => {
  return format(date, 'MMMM yyyy');
};

const formatHour = (hour: number) => {
  return hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
};

const previousWeek = () => {
  currentWeekStart.value = subWeeks(currentWeekStart.value, 1);
};

const nextWeek = () => {
  currentWeekStart.value = addWeeks(currentWeekStart.value, 1);
};

const currentWeek = () => {
  currentWeekStart.value = startOfWeek(new Date(), { weekStartsOn: 1 });
};

// Helper to check if a cell is in the current selection range
const isInSelectionRange = (day: number, hour: number) => {
  if (!isDragging.value) return false;
  
  // Handle selection across multiple days
  if (dragStartDay.value === dragEndDay.value) {
    // Same day selection
    return day === dragStartDay.value && 
           hour >= Math.min(dragStartHour.value, dragEndHour.value) && 
           hour <= Math.max(dragStartHour.value, dragEndHour.value);
  } else if (dragStartDay.value < dragEndDay.value) {
    // Forward selection across days
    return (day === dragStartDay.value && hour >= dragStartHour.value) || 
           (day === dragEndDay.value && hour <= dragEndHour.value) || 
           (day > dragStartDay.value && day < dragEndDay.value);
  } else {
    // Backward selection across days
    return (day === dragStartDay.value && hour <= dragStartHour.value) || 
           (day === dragEndDay.value && hour >= dragEndHour.value) || 
           (day < dragStartDay.value && day > dragEndDay.value);
  }
};

// Format the selection time for display
const formatSelectionTime = () => {
  if (!isDragging.value) return '';
  
  const startDate = addDays(currentWeekStart.value, dragStartDay.value);
  startDate.setHours(dragStartHour.value, 0, 0);
  
  const endDate = addDays(currentWeekStart.value, dragEndDay.value);
  endDate.setHours(dragEndHour.value + 1, 0, 0); // +1 to include the full hour
  
  return `${format(startDate, 'EEE, MMM d, h:mm a')} - ${format(endDate, 'EEE, MMM d, h:mm a')}`;
};

// Drag functionality
const startDrag = (event: MouseEvent, day: number, hour: number) => {
  isDragging.value = true;
  dragStartDay.value = day;
  dragStartHour.value = hour;
  dragEndDay.value = day;
  dragEndHour.value = hour;
  
  // Prevent text selection during drag
  event.preventDefault();
  
  console.log(`Started dragging at day ${day}, hour ${hour}`);
};

const onDrag = (event: MouseEvent, day: number, hour: number) => {
  if (isDragging.value) {
    dragEndDay.value = day;
    dragEndHour.value = hour;
  }
};

const onMouseLeave = (event: MouseEvent, day: number, hour: number) => {
  // Optional: Handle mouse leaving the calendar grid
  // This can be used to improve the drag experience
};

const endDrag = () => {
  if (isDragging.value) {
    isDragging.value = false;
    
    // Calculate the start and end times
    const startDate = addDays(currentWeekStart.value, dragStartDay.value);
    startDate.setHours(dragStartHour.value, 0, 0);
    
    const endDate = addDays(currentWeekStart.value, dragEndDay.value);
    endDate.setHours(dragEndHour.value + 1, 0, 0); // +1 to include the full hour
    
    // Normalize the selection (ensure start is before end)
    const normalizedSelection = {
      start: startDate <= endDate ? startDate : endDate,
      end: startDate <= endDate ? endDate : startDate
    };
    
    console.log('Selected time range:', normalizedSelection);
    
    // Open the activity modal with the selected time range
    showActivityModal.value = true;
    selectedTimeRange.value = normalizedSelection;
  }
};

// Handle activity submission from modal
const handleActivitySubmit = (activity: any) => {
  console.log('Activity submitted from modal:', activity);
  showActivityModal.value = false;
  // Here we would typically store the activity in a state management solution
};

// Handle global mouse up to end drag even if mouse is released outside the calendar
const handleGlobalMouseUp = () => {
  if (isDragging.value) {
    endDrag();
  }
};

onMounted(() => {
  // Add global event listener for mouseup to handle drag ending outside the calendar
  window.addEventListener('mouseup', handleGlobalMouseUp);
});

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('mouseup', handleGlobalMouseUp);
});
</script>

<style scoped>
.calendar-container {
  height: calc(100vh - 200px);
  overflow-y: auto;
}

.time-labels {
  position: sticky;
  left: 0;
  background-color: white;
  z-index: 10;
}

.hour-cell {
  cursor: pointer;
  position: relative;
}

.hour-cell:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.selection-preview {
  font-size: 0.875rem;
  max-width: 300px;
}
</style>
