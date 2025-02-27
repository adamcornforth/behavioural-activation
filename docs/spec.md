# Behavioral Activation App - Specification

---

## **Overview**

This specification outlines the requirements for developing a front-end application designed to
facilitate **Behavioral Activation** (BA) therapy. The app will help users plan and track
activities, rate the difficulty and impact on mood, and visualize progress. The goal is to create a
tool that encourages consistent engagement with activities, focuses on positive reinforcement, and
keeps the user experience simple and intuitive.

---

## **Core Features**

### **1. Activity Management**

- **Activity Creation**
    - **Time-Bound**: All activities must have a **start time** and **duration**.
    - **Categories**: Activities are categorized into predefined types (e.g., "Self-Care," "
      Exercise," "Social"). Categories are **optional** but encouraged.
    - **Expected Difficulty & Mood**: Users must set **expected difficulty** and **expected mood**
      when creating an activity.
    - **Custom Templates**: Users can create their own templates for repeated activities. Predefined
      templates will be available for common activity types (e.g., "Workout").

- **Activity Editing**
    - Activities can be **edited** before completion, but **cannot be edited after completion** (
      except for moving future instances of recurring activities, which will break the recurrence).
    - **Recurring Activities**: Users can schedule recurring activities (e.g., weekly, daily) but
      will not be able to change the recurrence once it is set.
    - **Deletion**: Activities can be deleted, and **confirmation** is required for deletion. Once
      deleted, activities are **permanently removed** without the ability to undo.

- **Activity Completion**
    - **Actual Difficulty & Mood**: After completing an activity, users rate the **actual difficulty
      ** and **mood impact**.
    - **Visual Feedback**: Completed activities are visually **prominent** with a checkmark and will
      be color-coded to reflect their impact (e.g., green for positive, red for negative).

### **2. Calendar View**

- **View Options**
    - The calendar will **default to a weekly view** but will allow users to switch between **daily
      ** and **monthly views**.
    - **Time-Slot Management**: Activities will be **time-bound** and cannot overlap.
    - Users can **drag and drop** activities to reschedule them, with **1-hour time slots**.
      Conflicting activities will be **blocked** and a **red highlight** will appear.

- **Event Creation**
    - Users can click on an empty time slot to create an activity. A **quick-add modal** will appear
      where the user can enter the activity name, expected difficulty, and expected mood.

- **Completed Activity Visualization**
    - Completed activities will remain visible on the calendar, with **no fading out**. Completed
      activities are **color-coded** based on their actual difficulty and mood rating.

### **3. Stats & Progress Tracking**

- **Mood & Difficulty Tracking**
    - Stats will track mood and difficulty **averages** across activities. Visualizations will
      include bar charts and pie charts.
    - **Trends**: Users can see **which activity types have the most impact** on their mood (e.g., "
      Social activities have boosted your mood the most").

- **Activity Insights**
    - The app will suggest insights based on activity trends (e.g., “You feel best after creative
      activities”).

### **4. User Experience & Customization**

- **Dark Mode**
    - The app will have **light** and **dark mode**, automatically switching based on the user’s
      system settings, but users can toggle between modes.

- **Onboarding**
    - A simple **onboarding process** will guide new users through the app’s key features, with a *
      *"skip" option** available.

- **Accessibility**
    - The app will include **basic accessibility features**, such as dark mode and color-coded
      activity feedback.

### **5. Data Handling**

- **Local Storage**
    - Data will be stored **locally on the device** using **IndexedDB or LocalStorage**. The app
      will not require cloud storage or sign-ups but is designed to allow future integration with
      cloud services (e.g., Firebase, Supabase).

- **Data Export**
    - Users can **export their data** as **CSV** or **JSON** files for backup or analysis.

### **6. Error Handling & User Feedback**

- **Confirmation Prompts**
    - Confirmation is required for **deleting activities**. Users will be prompted with a **warning
      **: “Are you sure you want to delete this activity? This action cannot be undone.”

- **Visual Feedback**
    - After making changes, users will see a subtle **"Saved" message** indicating that their
      changes have been recorded.

---

## **Architecture Choices**

### **Frontend Technology Stack**

- **Vite**: For fast development and optimized builds.
- **TypeScript**: Strongly typed development for better maintainability and fewer bugs.
- **Shadcn**: For reusable UI components.
- **TailwindCSS**: For rapid styling and design flexibility.

### **Data Handling & Storage**

- **Local Storage** (IndexedDB) for saving activities, stats, and user settings.
- **JSON-based exports** for backup and analysis.
- **Future Cloud Integration**: Cloud storage and authentication services will be added as needed.

---

## **Testing Plan**

### **Unit Tests**

- **Activity Creation**: Test creating and editing activities with correct time, mood, and
  difficulty settings.
- **Calendar Functionality**: Ensure drag-and-drop, time slot management, and event creation work
  smoothly.
- **Stats & Progress**: Verify that the stats calculation and visualizations reflect accurate data.

### **Integration Tests**

- **Activity Flow**: Ensure users can complete the full flow of creating, editing, and completing
  activities without issues.
- **Calendar Navigation**: Test navigation across different calendar views (week, day, month).

### **User Acceptance Testing (UAT)**

- **User Interface**: Confirm that the UI is intuitive, with easy access to calendar, activity
  creation, and stats features.
- **Edge Cases**: Test scenarios like no activities being planned, all activities completed, and
  multiple activities with overlapping times.

### **Performance Testing**

- **Offline Mode**: Test app performance when using it without internet connectivity, ensuring data
  is stored locally and synced when possible.

---

## **Conclusion**

This specification provides a detailed roadmap for implementing the **Behavioral Activation** app.
The core features have been clearly defined, with future enhancements planned as backlog items. The
structure supports a smooth user experience with powerful functionality for tracking activities,
mood, and progress, all while focusing on simplicity and ease of use.

---

End of Specification.
