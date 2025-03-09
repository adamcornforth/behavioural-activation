export const ACTIVITY_TYPES = {
  SELF_CARE: 'self-care',
  EXERCISE: 'exercise',
  SOCIAL: 'social',
  WORK: 'work',
  LEISURE: 'leisure',
  CREATIVE: 'creative',
  HOBBIES: 'hobbies',
  OUTDOOR: 'outdoor',
  OTHER: 'other'
} as const;

export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];

export interface ActivityTypeMetadata {
  value: ActivityType;
  label: string;
  color: string;
  icon?: string;
  description?: string;
}

export const activityTypeMetadata: Record<ActivityType, ActivityTypeMetadata> = {
  [ACTIVITY_TYPES.SELF_CARE]: {
    value: ACTIVITY_TYPES.SELF_CARE,
    label: 'Self-Care',
    color: 'blue-400',
    icon: 'heart',
    description: 'Activities focused on personal well-being and self-maintenance'
  },
  [ACTIVITY_TYPES.EXERCISE]: {
    value: ACTIVITY_TYPES.EXERCISE,
    label: 'Exercise',
    color: 'green-500',
    icon: 'dumbbell',
    description: 'Physical activities to maintain or improve fitness'
  },
  [ACTIVITY_TYPES.SOCIAL]: {
    value: ACTIVITY_TYPES.SOCIAL,
    label: 'Social',
    color: 'purple-500',
    icon: 'users',
    description: 'Activities involving interaction with others'
  },
  [ACTIVITY_TYPES.WORK]: {
    value: ACTIVITY_TYPES.WORK,
    label: 'Work',
    color: 'gray-600',
    icon: 'briefcase',
    description: 'Professional or academic responsibilities'
  },
  [ACTIVITY_TYPES.LEISURE]: {
    value: ACTIVITY_TYPES.LEISURE,
    label: 'Leisure',
    color: 'yellow-500',
    icon: 'film',
    description: 'Recreational activities for enjoyment'
  },
  [ACTIVITY_TYPES.CREATIVE]: {
    value: ACTIVITY_TYPES.CREATIVE,
    label: 'Creative',
    color: 'pink-500',
    icon: 'palette',
    description: 'Activities involving artistic expression'
  },
  [ACTIVITY_TYPES.HOBBIES]: {
    value: ACTIVITY_TYPES.HOBBIES,
    label: 'Hobbies',
    color: 'orange-500',
    icon: 'puzzle-piece',
    description: 'Regular activities done for enjoyment'
  },
  [ACTIVITY_TYPES.OUTDOOR]: {
    value: ACTIVITY_TYPES.OUTDOOR,
    label: 'Outdoor',
    color: 'emerald-500',
    icon: 'mountain',
    description: 'Activities done in nature or outside'
  },
  [ACTIVITY_TYPES.OTHER]: {
    value: ACTIVITY_TYPES.OTHER,
    label: 'Other',
    color: 'gray-400',
    icon: 'ellipsis-h',
    description: 'Activities that don\'t fit other categories'
  }
};

// Helper function to get all activity types as an array for dropdowns
export function getActivityTypeOptions(): Array<{value: ActivityType, label: string}> {
  return Object.values(activityTypeMetadata).map(type => ({
    value: type.value,
    label: type.label
  }));
}

// Helper function to get metadata for a specific activity type
export function getActivityTypeMetadata(type: ActivityType): ActivityTypeMetadata {
  return activityTypeMetadata[type] || activityTypeMetadata[ACTIVITY_TYPES.OTHER];
}

// Helper to get the appropriate color class for an activity type
export function getActivityTypeColorClass(type: ActivityType): string {
  const metadata = getActivityTypeMetadata(type);
  return `bg-${metadata.color}`;
}
