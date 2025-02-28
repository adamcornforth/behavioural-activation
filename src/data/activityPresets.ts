export interface ActivityPreset {
  id: string;
  name: string;
  expectedDifficulty: number;
  expectedMood: number;
  defaultDuration: number; // in minutes
  category: string;
  icon?: string;
  location?: string;
}

export const activityPresets: ActivityPreset[] = [
  // Exercise & Physical Activities
  {
    id: "morning-workout",
    name: "Morning Workout",
    expectedDifficulty: 7,
    expectedMood: 8,
    defaultDuration: 60,
    category: "Exercise",
    icon: "dumbbell",
    location: "Gym"
  },
  {
    id: "go-for-a-run",
    name: "Go for a Run",
    expectedDifficulty: 8,
    expectedMood: 7,
    defaultDuration: 45,
    category: "Exercise",
    icon: "running",
    location: "Park"
  },
  {
    id: "yoga-session",
    name: "Yoga Session",
    expectedDifficulty: 5,
    expectedMood: 9,
    defaultDuration: 60,
    category: "Exercise",
    icon: "yoga",
    location: "Home"
  },
  {
    id: "swimming",
    name: "Swimming",
    expectedDifficulty: 6,
    expectedMood: 8,
    defaultDuration: 45,
    category: "Exercise",
    icon: "swimming",
    location: "Pool"
  },
  
  // Work & Productivity
  {
    id: "team-meeting",
    name: "Team Meeting",
    expectedDifficulty: 4,
    expectedMood: 6,
    defaultDuration: 60,
    category: "Work",
    icon: "users",
    location: "Conference Room"
  },
  {
    id: "project-work",
    name: "Project Work",
    expectedDifficulty: 7,
    expectedMood: 6,
    defaultDuration: 120,
    category: "Work",
    icon: "briefcase",
    location: "Office"
  },
  {
    id: "email-processing",
    name: "Email Processing",
    expectedDifficulty: 3,
    expectedMood: 5,
    defaultDuration: 30,
    category: "Work",
    icon: "mail",
    location: "Home Office"
  },
  {
    id: "presentation-prep",
    name: "Presentation Prep",
    expectedDifficulty: 8,
    expectedMood: 5,
    defaultDuration: 90,
    category: "Work",
    icon: "presentation",
    location: "Office"
  },
  
  // Self-Care & Routine
  {
    id: "meditation",
    name: "Meditation",
    expectedDifficulty: 3,
    expectedMood: 9,
    defaultDuration: 15,
    category: "Self-Care",
    icon: "heart",
    location: "Home"
  },
  {
    id: "reading",
    name: "Reading",
    expectedDifficulty: 2,
    expectedMood: 8,
    defaultDuration: 45,
    category: "Self-Care",
    icon: "book",
    location: "Home"
  },
  {
    id: "journaling",
    name: "Journaling",
    expectedDifficulty: 3,
    expectedMood: 7,
    defaultDuration: 20,
    category: "Self-Care",
    icon: "edit",
    location: "Home"
  },
  {
    id: "brush-teeth",
    name: "Brush Teeth",
    expectedDifficulty: 1,
    expectedMood: 6,
    defaultDuration: 5,
    category: "Self-Care",
    icon: "smile",
    location: "Home"
  },
  
  // Social & Leisure
  {
    id: "lunch-with-friends",
    name: "Lunch with Friends",
    expectedDifficulty: 2,
    expectedMood: 9,
    defaultDuration: 90,
    category: "Social",
    icon: "coffee",
    location: "Cafe"
  },
  {
    id: "phone-call",
    name: "Phone Call",
    expectedDifficulty: 3,
    expectedMood: 7,
    defaultDuration: 30,
    category: "Social",
    icon: "phone",
    location: "Home"
  },
  {
    id: "movie-night",
    name: "Movie Night",
    expectedDifficulty: 1,
    expectedMood: 8,
    defaultDuration: 120,
    category: "Leisure",
    icon: "film",
    location: "Home"
  },
  {
    id: "video-games",
    name: "Video Games",
    expectedDifficulty: 2,
    expectedMood: 8,
    defaultDuration: 60,
    category: "Leisure",
    icon: "gamepad",
    location: "Home"
  },
  
  // Hobbies & Creative
  {
    id: "painting",
    name: "Painting",
    expectedDifficulty: 4,
    expectedMood: 9,
    defaultDuration: 90,
    category: "Creative",
    icon: "palette",
    location: "Home Studio"
  },
  {
    id: "playing-music",
    name: "Playing Music",
    expectedDifficulty: 5,
    expectedMood: 9,
    defaultDuration: 60,
    category: "Creative",
    icon: "music",
    location: "Home"
  },
  {
    id: "gardening",
    name: "Gardening",
    expectedDifficulty: 4,
    expectedMood: 8,
    defaultDuration: 60,
    category: "Hobbies",
    icon: "leaf",
    location: "Garden"
  },
  {
    id: "cooking",
    name: "Cooking",
    expectedDifficulty: 4,
    expectedMood: 7,
    defaultDuration: 60,
    category: "Hobbies",
    icon: "utensils",
    location: "Kitchen"
  },
  
  // Outdoor & Adventure
  {
    id: "hiking",
    name: "Hiking",
    expectedDifficulty: 6,
    expectedMood: 9,
    defaultDuration: 180,
    category: "Outdoor",
    icon: "mountain",
    location: "Mountain Trail"
  },
  {
    id: "cycling",
    name: "Cycling",
    expectedDifficulty: 7,
    expectedMood: 8,
    defaultDuration: 90,
    category: "Outdoor",
    icon: "bicycle",
    location: "Bike Path"
  },
  {
    id: "beach-day",
    name: "Beach Day",
    expectedDifficulty: 2,
    expectedMood: 9,
    defaultDuration: 240,
    category: "Outdoor",
    icon: "umbrella-beach",
    location: "Beach"
  }
];

// Helper function to get presets by category
export function getPresetsByCategory() {
  const categories: Record<string, ActivityPreset[]> = {};
  
  activityPresets.forEach(preset => {
    if (!categories[preset.category]) {
      categories[preset.category] = [];
    }
    categories[preset.category].push(preset);
  });
  
  return categories;
}

// Helper function to find a preset by ID
export function findPresetById(id: string): ActivityPreset | undefined {
  return activityPresets.find(preset => preset.id === id);
}
