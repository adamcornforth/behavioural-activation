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
            class="hour-cell h-20 border-b border-r border-gray-100 relative"
            @mouseup="endDrag()"
            @mouseleave="onMouseLeave($event, day - 1, hour)"
          >
            <!-- 15-minute interval markers -->
            <div 
              :class="[
                'quarter-hour-marker quarter-marker-25',
                { 'has-activity': hasActivityInQuarter(day - 1, hour, 0) }
              ]" 
              style="top: 0%; height: 25%"
              @mousedown="!hasActivityInQuarter(day - 1, hour, 0) && startDrag($event, day - 1, hour, 0)"
              @mousemove="onDrag($event, day - 1, hour, 0)"
            ></div>
            <div 
              :class="[
                'quarter-hour-marker quarter-marker-50',
                { 'has-activity': hasActivityInQuarter(day - 1, hour, 0.25) }
              ]" 
              style="top: 25%; height: 25%"
              @mousedown="!hasActivityInQuarter(day - 1, hour, 0.25) && startDrag($event, day - 1, hour, 0.25)"
              @mousemove="onDrag($event, day - 1, hour, 0.25)"
            ></div>
            <div 
              :class="[
                'quarter-hour-marker quarter-marker-75',
                { 'has-activity': hasActivityInQuarter(day - 1, hour, 0.5) }
              ]" 
              style="top: 50%; height: 25%"
              @mousedown="!hasActivityInQuarter(day - 1, hour, 0.5) && startDrag($event, day - 1, hour, 0.5)"
              @mousemove="onDrag($event, day - 1, hour, 0.5)"
            ></div>
            <div 
              :class="[
                'quarter-hour-marker quarter-marker-100',
                { 'has-activity': hasActivityInQuarter(day - 1, hour, 0.75) }
              ]" 
              style="top: 75%; height: 25%"
              @mousedown="!hasActivityInQuarter(day - 1, hour, 0.75) && startDrag($event, day - 1, hour, 0.75)"
              @mousemove="onDrag($event, day - 1, hour, 0.75)"
            ></div>
            <!-- Visual selection indicator -->
            <div
              v-if="isDragging && isInSelectionRange(day - 1, hour)"
              class="selection-indicator absolute inset-0 w-full opacity-70"
              :style="getSelectionStyle(day - 1, hour)"
            ></div>

            <!-- Render activities in this cell -->
            <div v-for="activity in getActivitiesForCell(day - 1, hour)" :key="activity.id" class="absolute inset-0">
              <div
                :class="[
                  'activity-block absolute left-0 right-0 px-1 py-0.5 z-20 overflow-hidden cursor-pointer group',
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
                @mouseup="endDrag()"
              >
                <!-- Delete button - only show on first cell and on hover -->
                <button
                  v-if="getActivityStyle(activity, day - 1, hour).isFirstHourCell"
                  class="delete-button absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  @click.stop="confirmDeleteActivity(activity)"
                  title="Delete activity"
                >
                  ×
                </button>
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

    <!-- Delete confirmation dialog -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">Delete Activity</h3>
        <p class="mb-4">Are you sure you want to delete "{{ activityToDelete?.activityName }}"?</p>
        <div class="flex justify-end space-x-3">
          <Button variant="outline" @click="cancelDelete">Cancel</Button>
          <Button variant="destructive" @click="deleteActivity">Delete</Button>
        </div>
      </div>
    </div>
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

// Delete confirmation state
const showDeleteConfirm = ref(false);
const activityToDelete = ref<any>(null);

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
  
  // Convert hour to hour range for the cell (e.g., hour 9 = 9.0 to 9.99)
  const hourStart = hour;
  const hourEnd = hour + 0.99;
  
  // Handle selection across multiple days
  if (dragStartDay.value === dragEndDay.value) {
    // Same day selection
    return day === dragStartDay.value && 
           hourEnd >= Math.min(dragStartHour.value, dragEndHour.value) && 
           hourStart <= Math.max(dragStartHour.value, dragEndHour.value);
  } else if (dragStartDay.value < dragEndDay.value) {
    // Forward selection across days
    return (day === dragStartDay.value && hourEnd >= dragStartHour.value) || 
           (day === dragEndDay.value && hourStart <= dragEndHour.value) || 
           (day > dragStartDay.value && day < dragEndDay.value);
  } else {
    // Backward selection across days
    return (day === dragStartDay.value && hourStart <= dragStartHour.value) || 
           (day === dragEndDay.value && hourEnd >= dragEndHour.value) || 
           (day < dragStartDay.value && day > dragEndDay.value);
  }
};

// Calculate the style for the selection indicator with 15-minute precision
const getSelectionStyle = (day: number, hour: number) => {
  if (!isDragging.value) return {};
  
  // Normalize selection to ensure start is before end
  const [startDay, startHour, endDay, endHour] = 
    dragStartDay.value <= dragEndDay.value || 
    (dragStartDay.value === dragEndDay.value && dragStartHour.value <= dragEndHour.value)
      ? [dragStartDay.value, dragStartHour.value, dragEndDay.value, dragEndHour.value]
      : [dragEndDay.value, dragEndHour.value, dragStartDay.value, dragStartHour.value];
  
  // Calculate top and height based on 15-minute intervals
  let top = 0;
  let height = '100%';
  
  // If this is the start day and hour
  if (day === startDay && Math.floor(startHour) === hour) {
    // Calculate the fractional part (0, 0.25, 0.5, 0.75)
    const fractionalPart = startHour - Math.floor(startHour);
    top = fractionalPart * 100;
    
    // If this is also the end cell
    if (day === endDay && Math.floor(endHour) === hour) {
      const endFractionalPart = endHour - Math.floor(endHour);
      height = `${(endFractionalPart - fractionalPart) * 100 + 25}%`; // +25% to include the full 15-min interval
    } else {
      height = `${100 - top}%`;
    }
  } 
  // If this is the end day and hour
  else if (day === endDay && Math.floor(endHour) === hour) {
    const fractionalPart = endHour - Math.floor(endHour);
    height = `${(fractionalPart + 0.25) * 100}%`; // +0.25 to include the full 15-min interval
  }
  
  return {
    top: `${top}%`,
    height,
    background: 'rgba(59, 130, 246, 0.3)',
    border: '1px solid rgba(59, 130, 246, 0.5)',
    borderRadius: '0.125rem',
  };
};

// Format the selection time for display
const formatSelectionTime = () => {
  if (!isDragging.value) return '';
  
  const startDate = addDays(currentWeekStart.value, dragStartDay.value);
  const startMinutes = Math.floor(dragStartHour.value * 4) * 15;
  startDate.setHours(Math.floor(dragStartHour.value), startMinutes % 60, 0);
  
  const endDate = addDays(currentWeekStart.value, dragEndDay.value);
  const endMinutes = Math.floor(dragEndHour.value * 4) * 15;
  endDate.setHours(Math.floor(dragEndHour.value), endMinutes % 60, 0);
  // Add 15 minutes to include the full interval
  endDate.setMinutes(endDate.getMinutes() + 15);
  
  return `${format(startDate, 'EEE, MMM d, h:mm a')} - ${format(endDate, 'EEE, MMM d, h:mm a')}`;
};

// Drag functionality
const startDrag = (event: MouseEvent, day: number, hour: number, quarterHour: number) => {
  isDragging.value = true;
  dragStartDay.value = day;
  dragStartHour.value = hour + quarterHour;
  dragEndDay.value = day;
  dragEndHour.value = hour + quarterHour;
  
  // Prevent text selection during drag
  event.preventDefault();
  
  console.log(`Started dragging at day ${day}, hour ${dragStartHour.value}`);
};

const onDrag = (event: MouseEvent, day: number, hour: number, quarterHour: number) => {
  if (isDragging.value) {
    dragEndDay.value = day;
    dragEndHour.value = hour + quarterHour;
  }
};

const onMouseLeave = (event: MouseEvent, day: number, hour: number) => {
  // Optional: Handle mouse leaving the calendar grid
  // This can be used to improve the drag experience
};

const endDrag = () => {
  if (isDragging.value) {
    isDragging.value = false;
    
    // Calculate the start and end times with 15-minute precision
    const startDate = addDays(currentWeekStart.value, dragStartDay.value);
    const startHourWhole = Math.floor(dragStartHour.value);
    const startMinutes = Math.round((dragStartHour.value - startHourWhole) * 60);
    startDate.setHours(startHourWhole, startMinutes, 0);
    
    const endDate = addDays(currentWeekStart.value, dragEndDay.value);
    const endHourWhole = Math.floor(dragEndHour.value);
    const endMinutes = Math.round((dragEndHour.value - endHourWhole) * 60);
    endDate.setHours(endHourWhole, endMinutes + 15, 0); // +15 minutes to include the full interval
    
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

// Delete activity confirmation
const confirmDeleteActivity = (activity: any) => {
  activityToDelete.value = activity;
  showDeleteConfirm.value = true;
};

// Cancel delete
const cancelDelete = () => {
  showDeleteConfirm.value = false;
  activityToDelete.value = null;
};

// Delete activity
const deleteActivity = () => {
  if (activityToDelete.value) {
    activityStore.deleteActivity(activityToDelete.value.id);
    showDeleteConfirm.value = false;
    activityToDelete.value = null;
  }
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

// Check if a specific 15-minute block has an activity
const hasActivityInQuarter = (day: number, hour: number, quarterHour: number) => {
  const date = addDays(currentWeekStart.value, day);
  
  // Calculate the start and end times for this 15-minute block
  const blockStart = new Date(date);
  blockStart.setHours(hour, quarterHour * 60, 0, 0);
  
  const blockEnd = new Date(date);
  blockEnd.setHours(hour, (quarterHour * 60) + 15, 0, 0);
  
  // Check if any activity overlaps with this 15-minute block
  return activities.value.some(activity => {
    return activity.startTime < blockEnd && activity.endTime > blockStart;
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
  position: relative;
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
  z-index: 30; /* Higher than quarter-hour markers */
}

.activity-block.activity-hovered,
.activity-block:hover {
  filter: brightness(0.95);
  z-index: 30;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.delete-button:hover {
  background-color: #ef4444;
}

/* Apply hover effect to all blocks of the same activity */
[class*="activity-"]:hover ~ [class*="activity-"] {
  filter: brightness(0.95);
  z-index: 30;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

/* 15-minute interval markers */
.quarter-hour-marker {
  position: absolute;
  left: 0;
  right: 0;
  background-color: transparent;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s ease;
  cursor: pointer;
  z-index: 20;
}

.quarter-hour-marker:not(.has-activity):hover {
  background-color: rgba(59, 130, 246, 0.1);
  border-top: 1px solid rgba(59, 130, 246, 0.3);
}

/* Different colors for each marker to make them more distinguishable */
.quarter-marker-25:not(.has-activity):hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.quarter-marker-50:not(.has-activity):hover {
  background-color: rgba(59, 130, 246, 0.15);
}

.quarter-marker-75:not(.has-activity):hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.quarter-marker-100:not(.has-activity):hover {
  background-color: rgba(59, 130, 246, 0.15);
}

/* Styling for markers that have activities */
.quarter-hour-marker.has-activity {
  cursor: default;
}

.selection-indicator {
  pointer-events: none;
  z-index: 15;
}
</style>
