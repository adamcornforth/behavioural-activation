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
            
            <!-- Render activities in this cell -->
            <div v-for="activity in getActivitiesForCell(day - 1, hour)" :key="activity.id" class="relative h-full">
              <div 
                :class="[
                  'activity-block absolute left-0 right-0 px-1 py-0.5 z-20 overflow-hidden cursor-pointer',
                  `activity-${activity.id}`,
                  getActivityStyle(activity, day - 1, hour).colorClass,
                  getActivityStyle(activity, day - 1, hour).borderRadius,
                  getActivityStyle(activity, day - 1, hour).borderStyle
                ]"
                :style="{
                  top: getActivityStyle(activity, day - 1, hour).top,
                  height: getActivityStyle(activity, day - 1, hour).height,
                  display: getActivityStyle(activity, day - 1, hour).display === 'none' ? 'none' : 'block'
                }"
                @click="editActivity(activity)"
                @mouseenter="handleActivityHover(activity.id, true)"
                @mouseleave="handleActivityHover(activity.id, false)"
              >
                <template v-if="getActivityStyle(activity, day - 1, hour).isFirstHourCell">
                  <div class="text-xs font-medium truncate">{{ activity.activityName }}</div>
                  <div class="text-xs truncate">
                    {{ getActivityStyle(activity, day - 1, hour).duration }}
                  </div>
                  <div class="text-xs truncate" v-if="getActivityStyle(activity, day - 1, hour).height > 30">
                    Difficulty: {{ activity.expectedDifficulty }}/10
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- Selection preview -->
      <div v-if="isDragging" class="selection-preview fixed bottom-4 right-4 bg-white p-3 shadow-lg rounded-md border border-gray-200 z-50">
        <p class="font-medium">Selection:</p>
        <p>{{ formatSelectionTime() }}</p>
      </div>
    </div>
    
    <!-- Activity modal -->
    <ActivityModal 
      :open="showActivityModal" 
      :start-time="selectedTimeRange?.start" 
      :end-time="selectedTimeRange?.end"
      :edit-activity="activityToEdit"
      @close="closeActivityModal"
      @submit="handleActivitySubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isWithinInterval, isSameDay } from 'date-fns';
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
const activityToEdit = ref<any>(null);

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

// Import the activity store
import { useActivityStore } from '../store/activityStore';

// Get the activity store
const activityStore = useActivityStore();

// Get all activities
const activities = computed(() => activityStore.getActivities());

// Handle activity submission from modal
const handleActivitySubmit = (activity: any) => {
  if (activityToEdit.value) {
    // Update existing activity
    activityStore.updateActivity(activityToEdit.value.id, activity);
  } else {
    // Add new activity
    const newActivity = {
      ...activity,
      completed: false
    };
    activityStore.addActivity(newActivity);
  }
  closeActivityModal();
};

// Close modal and reset state
const closeActivityModal = () => {
  showActivityModal.value = false;
  activityToEdit.value = null;
};

// Handle activity hover
const handleActivityHover = (activityId: string, isHovering: boolean) => {
  const activityBlocks = document.querySelectorAll(`.activity-${activityId}`);
  activityBlocks.forEach(block => {
    if (isHovering) {
      block.classList.add('activity-hovered');
    } else {
      block.classList.remove('activity-hovered');
    }
  });
};

// Edit an existing activity
const editActivity = (activity: any) => {
  activityToEdit.value = activity;
  selectedTimeRange.value = {
    start: activity.startTime,
    end: activity.endTime
  };
  showActivityModal.value = true;
};

// Helper to determine if an activity falls within a specific day and hour
const getActivitiesForCell = (day: number, hour: number) => {
  const date = addDays(currentWeekStart.value, day);
  const startHour = new Date(date);
  startHour.setHours(hour, 0, 0, 0);
  
  const endHour = new Date(date);
  endHour.setHours(hour + 1, 0, 0, 0);
  
  return activities.value.filter(activity => {
    // An activity should be displayed in this cell if it overlaps with this hour cell at all
    return (
      // Activity starts before cell ends AND activity ends after cell starts
      activity.startTime < endHour && activity.endTime > startHour &&
      // Activity is on the same day as this cell
      (isSameDay(activity.startTime, date) || isSameDay(activity.endTime, date) || 
       (activity.startTime < startHour && activity.endTime > endHour))
    );
  });
};

// Format duration for display
const formatDuration = (startTime: Date, endTime: Date) => {
  const durationMs = endTime.getTime() - startTime.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
};

// Calculate activity position and height based on its time
const getActivityStyle = (activity: any, day: number, hour: number) => {
  const date = addDays(currentWeekStart.value, day);
  const cellStart = new Date(date);
  cellStart.setHours(hour, 0, 0, 0);
  
  const cellEnd = new Date(date);
  cellEnd.setHours(hour + 1, 0, 0, 0);
  
  // Get the actual time boundaries for this activity in this cell
  const activityStartInCell = activity.startTime > cellStart ? activity.startTime : cellStart;
  const activityEndInCell = activity.endTime < cellEnd ? activity.endTime : cellEnd;
  
  // Calculate the position within the cell (as percentage)
  const minutesInHour = 60;
  const cellStartMinutes = hour * minutesInHour;
  
  // Calculate top position relative to the cell
  const activityStartMinutes = activityStartInCell.getHours() * minutesInHour + activityStartInCell.getMinutes();
  const topOffset = activityStartMinutes - cellStartMinutes;
  const topPercentage = (topOffset / minutesInHour) * 100;
  
  // Calculate height
  const activityEndMinutes = activityEndInCell.getHours() * minutesInHour + activityEndInCell.getMinutes();
  const durationMinutes = activityEndMinutes - activityStartMinutes;
  const heightPercentage = (durationMinutes / minutesInHour) * 100;
  
  // Ensure minimum height for visibility
  const adjustedHeightPercentage = Math.max(heightPercentage, 10);
  
  // Calculate total duration for display
  const duration = formatDuration(activity.startTime, activity.endTime);
  
  // Determine if this is the first visible cell for this activity
  const isFirstCell = activity.startTime >= cellStart && activity.startTime < cellEnd;
  
  // Determine if this is the last visible cell for this activity
  const isLastCell = activity.endTime > cellStart && activity.endTime <= cellEnd;
  
  // Special case: if activity ends exactly at the end of this cell
  const endsAtCellEnd = activity.endTime.getTime() === cellEnd.getTime();
  
  // Special case: if activity spans exactly this cell
  const spansExactlyThisCell = activity.startTime.getTime() === cellStart.getTime() && 
                              activity.endTime.getTime() === cellEnd.getTime();
  
  // Determine if this is a middle cell (not first, not last)
  const isMiddleCell = !isFirstCell && !isLastCell;
  
  // Get color based on expected mood
  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'bg-green-100 border-green-300';
    if (mood >= 6) return 'bg-blue-100 border-blue-300';
    if (mood >= 4) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };
  
  // Determine border radius
  let borderRadius = 'rounded-sm';
  
  // Single-cell activity
  if (isFirstCell && isLastCell) {
    borderRadius = 'rounded-sm';
  }
  // First cell of multi-cell activity
  else if (isFirstCell) {
    borderRadius = 'rounded-t-sm';
  }
  // Last cell of multi-cell activity
  else if (isLastCell || endsAtCellEnd) {
    borderRadius = 'rounded-b-sm';
  }
  // Middle cell of multi-cell activity
  else {
    borderRadius = 'rounded-none';
  }
  
  // Determine border style
  let borderStyle = 'border';
  
  // Single-cell activity
  if (isFirstCell && isLastCell) {
    borderStyle = 'border';
  }
  // First cell of multi-cell activity
  else if (isFirstCell) {
    borderStyle = 'border-t border-l border-r';
  }
  // Last cell of multi-cell activity (including those ending exactly at cell end)
  else if (isLastCell || endsAtCellEnd) {
    borderStyle = 'border-b border-l border-r';
  }
  // Middle cell of multi-cell activity
  else {
    borderStyle = 'border-l border-r';
  }
  
  // Special case for activities that span exactly one cell
  if (spansExactlyThisCell) {
    borderRadius = 'rounded-sm';
    borderStyle = 'border';
  }
  
  // Determine if this cell should be displayed
  const shouldDisplay = activity.startTime < cellEnd && activity.endTime > cellStart;
  
  return {
    top: `${topPercentage}%`,
    height: `${adjustedHeightPercentage}%`,
    colorClass: getMoodColor(activity.expectedMood),
    display: shouldDisplay ? 'block' : 'none',
    isFirstHourCell: isFirstCell,
    isLastHourCell: isLastCell,
    isMiddleHourCell: isMiddleCell,
    duration,
    borderRadius,
    borderStyle
  };
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

.activity-block {
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 1.5rem;
  box-sizing: border-box;
}

.activity-block.activity-hovered,
.activity-block:hover {
  filter: brightness(0.95);
  z-index: 30;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

/* Apply hover effect to all blocks of the same activity */
[class*="activity-"]:hover ~ [class*="activity-"] {
  filter: brightness(0.95);
  z-index: 30;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}
</style>
