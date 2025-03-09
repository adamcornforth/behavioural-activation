<template>
  <div class="calendar-container">
    <div class="calendar-header sticky top-0 bg-white dark:bg-gray-800 z-50 drop-shadow-md dark:drop-shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold dark:text-white">{{ formatDate(currentWeekStart) }}</h2>
        <div class="flex gap-2">
          <Button @click="previousWeek" variant="outline" size="sm" class="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            <ChevronLeft class="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button @click="currentWeek" variant="outline" size="sm" class="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            Today
          </Button>
          <Button @click="nextWeek" variant="outline" size="sm" class="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            Next
            <ChevronRight class="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      <div class="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700">
        <div class="py-2 text-center"></div>
        <div 
          v-for="day in weekDays" 
          :key="day.date" 
          class="py-2 text-center font-medium dark:text-gray-300"
          :class="{ 'bg-blue-50 dark:bg-blue-900/30 rounded-t-md': day.isToday }"
        >
          <div>{{ day.name }}</div>
          <div>{{ day.date }}</div>
        </div>
      </div>
    </div>
    <div class="calendar-body grid grid-cols-8">
      <!-- Time labels -->
      <div class="time-labels">
        <div v-for="hour in hours" :key="hour" class="time-label h-20 border-b border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 pr-2 text-right">
          {{ formatHour(hour) }}
        </div>
      </div>

      <!-- Calendar grid -->
      <template v-for="day in 7" :key="day">
        <div class="day-column">
          <div
            v-for="hour in hours"
            :key="hour"
            class="hour-cell h-20 border-b border-r border-gray-100 dark:border-gray-700 relative"
            :class="{
              'bg-blue-50 dark:bg-blue-900/20': day - 1 === currentDayIndex && hour === currentHour,
              'bg-blue-50/50 dark:bg-blue-900/10': day - 1 === currentDayIndex && hour !== currentHour
            }"
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

            <!-- Current time indicator -->
            <div 
              v-if="day - 1 === currentDayIndex && hour === currentHour" 
              class="current-time-indicator"
              :style="{
                top: `${(currentDate.getMinutes() / 60) * 100}%`
              }"
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
                  :class="[
                    'delete-button absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 transition-opacity',
                    { 'opacity-100': hoveredActivityId === activity.id }
                  ]"
                  @click.stop="confirmDeleteActivity(activity)"
                  title="Delete activity"
                >
                  ×
                </button>
                <template v-if="getActivityStyle(activity, day - 1, hour).isFirstHourCell">
                  <div class="flex items-center">
                    <!-- Activity type icon -->
                    <div v-if="getActivityTypeIcon(activity.activityType)" 
                         class="mr-1 w-4 h-4 flex items-center justify-center text-gray-600 dark:text-gray-400"
                         :title="getActivityTypeLabel(activity.activityType)">
                      <component :is="getActivityTypeIcon(activity.activityType)" class="w-3 h-3" />
                    </div>
                    <div class="text-xs font-medium truncate flex-1">{{ activity.activityName }}</div>
                    <!-- Feedback indicator -->
                    <div v-if="needsFeedback(activity)" 
                         class="ml-1 w-3 h-3 rounded-full bg-yellow-400" 
                         title="Needs feedback">
                    </div>
                    <!-- Completed indicator -->
                    <div v-else-if="activity.completed"
                         class="ml-1 w-4 h-4 flex items-center justify-center text-green-600 dark:text-green-400"
                         title="Completed">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </div>
                  </div>
                  <div class="text-xs truncate">
                    {{ getActivityStyle(activity, day - 1, hour).duration }}
                  </div>
                  <div class="text-xs truncate"
                       v-if="Number.parseInt(getActivityStyle(activity, day - 1, hour).height) > 10">
                    <span>Difficulty: {{ activity.expectedDifficulty }}/10</span>
                    <span v-if="activity.completed && activity.actualDifficulty !== undefined" 
                          :class="getDifficultyComparisonClass(activity)">
                      ({{ getDifficultyComparisonText(activity) }})
                    </span>
                  </div>
                  <div class="text-xs truncate"
                       v-if="Number.parseInt(getActivityStyle(activity, day - 1, hour).height) > 10">
                    <span>Mood: {{ activity.expectedMood }}/10</span>
                    <span v-if="activity.completed && activity.actualMood !== undefined"
                          :class="getMoodComparisonClass(activity)">
                      ({{ getMoodComparisonText(activity) }})
                    </span>
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
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg- shadow-lg max-w-md w-full">
        <h3 class="text-lg font-medium mb-4 dark:text-white">Delete Activity</h3>
        <p class="mb-4 dark:text-gray-300">Are you sure you want to delete "{{ activityToDelete?.activityName }}"?</p>
        <div class="flex justify-end space-x-3">
          <Button variant="outline" @click="cancelDelete" class="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</Button>
          <Button variant="destructive" @click="deleteActivity">Delete</Button>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isWithinInterval, isSameDay, differenceInDays } from 'date-fns';
import Button from './ui/button.vue';
import { ChevronLeft, ChevronRight, Heart, Dumbbell, Users, Briefcase, Film, Palette, Puzzle, Mountain, MoreHorizontal } from 'lucide-vue-next';
import ActivityModal from './ActivityModal.vue';
import { ActivityType, ACTIVITY_TYPES, getActivityTypeMetadata } from '../types/activityTypes';

// State
const currentWeekStart = ref(startOfWeek(new Date(), { weekStartsOn: 1 })); // Start on Monday
const currentDate = ref(new Date());
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


const hours = Array.from({ length: 15 }, (_, i) => i + 8);

// Computed properties
const weekDays = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeekStart.value, i);
    const isToday = isSameDay(date, currentDate.value);
    return {
      name: format(date, 'EEE'),
      date: format(date, 'd'),
      fullDate: date,
      isToday
    };
  });
});

// Current hour for highlighting
const currentHour = computed(() => {
  return currentDate.value.getHours();
});

// Current day index (0-6) for highlighting
const currentDayIndex = computed(() => {
  const daysDiff = differenceInDays(
    currentDate.value,
    currentWeekStart.value
  );
  return daysDiff >= 0 && daysDiff < 7 ? daysDiff : -1;
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

// Helper functions for activity types
const getActivityTypeIcon = (type: ActivityType) => {
  switch (type) {
    case ACTIVITY_TYPES.SELF_CARE:
      return Heart;
    case ACTIVITY_TYPES.EXERCISE:
      return Dumbbell;
    case ACTIVITY_TYPES.SOCIAL:
      return Users;
    case ACTIVITY_TYPES.WORK:
      return Briefcase;
    case ACTIVITY_TYPES.LEISURE:
      return Film;
    case ACTIVITY_TYPES.CREATIVE:
      return Palette;
    case ACTIVITY_TYPES.HOBBIES:
      return Puzzle;
    case ACTIVITY_TYPES.OUTDOOR:
      return Mountain;
    default:
      return MoreHorizontal;
  }
};

const getActivityTypeLabel = (type: ActivityType) => {
  const metadata = getActivityTypeMetadata(type);
  return metadata.label;
};

// Import the activity store
import { useActivityStore } from '../store/activityStore';

// Get the activity store
const activityStore = useActivityStore();

// Get all activities
const activities = computed(() => {
  const allActivities = activityStore.getActivities();
  
  // If there are no activities, create some default ones
  if (allActivities.length === 0) {
    createDefaultActivities();
  }
  
  return activityStore.getActivities();
});

// Set up polling to check for activities needing feedback
let feedbackCheckInterval: number | null = null;

// Create default activities for first-time users
const createDefaultActivities = () => {
  // Get the current week's Monday at 9 AM
  const monday = new Date(currentWeekStart.value);
  monday.setHours(9, 0, 0, 0);
  
  // Create a morning workout for Monday
  const workout = {
    id: crypto.randomUUID(),
    activityName: "Morning Workout",
    startTime: new Date(monday),
    endTime: new Date(monday.setHours(10, 0, 0, 0)),
    expectedDifficulty: 7,
    expectedMood: 8,
    location: "Gym",
    activityType: ACTIVITY_TYPES.EXERCISE,
    createdAt: new Date(),
    completed: false,
    notes: "",
    participants: ""
  };
  
  // Create a team meeting for Tuesday at 11 AM
  const tuesday = new Date(currentWeekStart.value);
  tuesday.setDate(tuesday.getDate() + 1); // Tuesday
  tuesday.setHours(11, 0, 0, 0);
  
  const meeting = {
    id: crypto.randomUUID(),
    activityName: "Team Meeting",
    startTime: new Date(tuesday),
    endTime: new Date(new Date(tuesday).setHours(12, 30, 0, 0)),
    expectedDifficulty: 4,
    expectedMood: 6,
    location: "Conference Room",
    activityType: ACTIVITY_TYPES.WORK,
    createdAt: new Date(),
    completed: false,
    notes: "",
    participants: ""
  };
  
  // Create a lunch with friends on Wednesday
  const wednesday = new Date(currentWeekStart.value);
  wednesday.setDate(wednesday.getDate() + 2); // Wednesday
  wednesday.setHours(12, 30, 0, 0);
  
  const lunch = {
    id: crypto.randomUUID(),
    activityName: "Lunch with Friends",
    startTime: new Date(wednesday),
    endTime: new Date(new Date(wednesday).setHours(13, 30, 0, 0)),
    expectedDifficulty: 2,
    expectedMood: 9,
    location: "Cafe Downtown",
    activityType: ACTIVITY_TYPES.SOCIAL,
    createdAt: new Date(),
    completed: false,
    notes: "",
    participants: ""
  };
  
  // Create a project work session on Thursday
  const thursday = new Date(currentWeekStart.value);
  thursday.setDate(thursday.getDate() + 3); // Thursday
  thursday.setHours(14, 0, 0, 0);
  
  const project = {
    id: crypto.randomUUID(),
    activityName: "Project Work",
    startTime: new Date(thursday),
    endTime: new Date(new Date(thursday).setHours(17, 0, 0, 0)),
    expectedDifficulty: 8,
    expectedMood: 7,
    location: "Home Office",
    activityType: ACTIVITY_TYPES.WORK,
    createdAt: new Date(),
    completed: false,
    notes: "",
    participants: ""
  };
  
  // Create a weekend hike on Saturday
  const saturday = new Date(currentWeekStart.value);
  saturday.setDate(saturday.getDate() + 5); // Saturday
  saturday.setHours(10, 0, 0, 0);
  
  const hike = {
    id: crypto.randomUUID(),
    activityName: "Weekend Hike",
    startTime: new Date(saturday),
    endTime: new Date(new Date(saturday).setHours(14, 0, 0, 0)),
    expectedDifficulty: 6,
    expectedMood: 10,
    location: "Mountain Trail",
    activityType: ACTIVITY_TYPES.OUTDOOR,
    createdAt: new Date(),
    completed: false,
    notes: "",
    participants: ""
  };
  
  // Add all default activities
  activityStore.addActivity(workout);
  activityStore.addActivity(meeting);
  activityStore.addActivity(lunch);
  activityStore.addActivity(project);
  activityStore.addActivity(hike);
};

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
  selectedTimeRange.value = null;
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

// Track currently hovered activity
const hoveredActivityId = ref<string | null>(null);

// Handle activity hover
const handleActivityHover = (activityId: string, isHovering: boolean) => {
  hoveredActivityId.value = isHovering ? activityId : null;
  
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

// Check if an activity needs feedback
const needsFeedback = (activity: any) => {
  const now = new Date();
  return activity.endTime < now && 
         !activity.completed &&
         (activity.actualDifficulty === undefined || activity.actualMood === undefined);
};

// Get difficulty comparison text
const getDifficultyComparisonText = (activity: any) => {
  if (activity.actualDifficulty === undefined) return '';
  
  const diff = activity.actualDifficulty - activity.expectedDifficulty;
  if (diff === 0) return 'same';
  return diff > 0 ? `+${diff}` : `${diff}`;
};

// Get difficulty comparison class
const getDifficultyComparisonClass = (activity: any) => {
  if (activity.actualDifficulty === undefined) return '';
  
  const diff = activity.actualDifficulty - activity.expectedDifficulty;
  if (diff === 0) return 'text-gray-500 dark:text-gray-400';
  return diff > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400';
};

// Get mood comparison text
const getMoodComparisonText = (activity: any) => {
  if (activity.actualMood === undefined) return '';
  
  const diff = activity.actualMood - activity.expectedMood;
  if (diff === 0) return 'same';
  return diff > 0 ? `+${diff}` : `${diff}`;
};

// Get mood comparison class
const getMoodComparisonClass = (activity: any) => {
  if (activity.actualMood === undefined) return '';
  
  const diff = activity.actualMood - activity.expectedMood;
  if (diff === 0) return 'text-gray-500 dark:text-gray-400';
  return diff > 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';
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
  
  // Get color based on activity type
  const getMoodColor = (activity: any) => {
    // Use activity type color if available
    const metadata = getActivityTypeMetadata(activity.activityType);
    const colorBase = metadata.color.split('-')[0]; // Extract base color (e.g., "blue" from "blue-400")
    
    // Fallback to mood-based colors if needed
    if (!colorBase) {
      if (activity.expectedMood >= 8) return 'bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700 dark:text-green-100';
      if (activity.expectedMood >= 6) return 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-100';
      if (activity.expectedMood >= 4) return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-100';
      return 'bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700 dark:text-red-100';
    }
    
    // Use activity type color
    return `bg-${colorBase}-100 border-${colorBase}-300 dark:bg-${colorBase}-900 dark:border-${colorBase}-700 dark:text-${colorBase}-100`;
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
    colorClass: getMoodColor(activity),
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

// Update current time every minute
let currentTimeInterval: number | null = null;

const updateCurrentTime = () => {
  currentDate.value = new Date();
};

onMounted(() => {
  // Add global event listener for mouseup to handle drag ending outside the calendar
  window.addEventListener('mouseup', handleGlobalMouseUp);
  
  // Update current time immediately and then every minute
  updateCurrentTime();
  currentTimeInterval = window.setInterval(updateCurrentTime, 60000);
});

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('mouseup', handleGlobalMouseUp);
  
  // Clear the feedback check interval
  if (feedbackCheckInterval !== null) {
    clearInterval(feedbackCheckInterval);
  }
  
  // Clear the current time interval
  if (currentTimeInterval !== null) {
    clearInterval(currentTimeInterval);
  }
});
</script>

<style scoped>
.calendar-container {
  height: calc(100vh - 132px);
  overflow-y: auto;
}

.time-labels {
  position: sticky;
  left: 0;
  z-index: 10;
}

:global(.dark) .time-labels {
  background-color: #1f2937; /* dark:bg-gray-800 */
}

.hour-cell {
  position: relative;
}

.selection-preview {
  font-size: 0.875rem;
  max-width: 300px;
}

:global(.dark) .selection-preview {
  background-color: #1f2937;
  color: white;
  border-color: #374151;
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

:global(.dark) .activity-block.activity-hovered,
:global(.dark) .activity-block:hover {
  filter: brightness(1.1);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
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

:global(.dark) [class*="activity-"]:hover ~ [class*="activity-"] {
  filter: brightness(1.1);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
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

:global(.dark) .quarter-hour-marker {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.quarter-hour-marker:not(.has-activity):hover {
  background-color: rgba(59, 130, 246, 0.1);
  border-top: 1px solid rgba(59, 130, 246, 0.3);
}

:global(.dark) .quarter-hour-marker:not(.has-activity):hover {
  background-color: rgba(59, 130, 246, 0.2);
  border-top: 1px solid rgba(59, 130, 246, 0.4);
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

:global(.dark) .selection-indicator {
  background: rgba(59, 130, 246, 0.4) !important;
  border: 1px solid rgba(59, 130, 246, 0.6) !important;
}

.current-time-indicator {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #ef4444; /* red-500 */
  z-index: 25;
  pointer-events: none;
}

:global(.dark) .current-time-indicator {
  background-color: #f87171; /* red-400 */
  box-shadow: 0 0 4px rgba(248, 113, 113, 0.6);
}
</style>
