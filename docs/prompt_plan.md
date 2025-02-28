# prompt_plan.md

Below is a structured, multi-round plan that takes the project idea from a broad blueprint to
step-by-step instructions, and finally to a sequence of code-generation prompts. The plan
incrementally refines the solution so that each stage is clear and builds on the previous steps,
with no orphaned or incomplete code.

---

## 1. High-Level Blueprint

1. **Core Feature: Calendar-based Activity Planning**
    - Display a week or month calendar view.
    - Users can click and drag to create an activity time block.
    - A modal with minimal required fields (Activity Name, Expected Difficulty, Expected Mood).
    - Optional fields hidden behind a “More fields” expansion.

2. **Retrospective Feedback**
    - Once an activity’s scheduled time passes, prompt the user to record:
        - Actual Difficulty
        - Actual Mood
    - Visually display when expectations are exceeded or met (e.g., highlight completed tasks that
      felt easier or improved mood more than anticipated).

3. **Presets for Activities**
    - Provide a list of common activities (e.g., “Brush teeth,” “Go for a run,” “Movie night,”
      “Painting,” “Bath,” etc.) to reduce planning friction.

4. **Analytics and Statistics**
    - Track which activities most positively affect mood.
    - Compare expected vs. actual difficulty.
    - Highlight areas where the user is doing better than expected.

5. **Overall Goal**
    - Focus on positive reinforcement of successful behavior planning.
    - Encourage consistent usage through simple, approachable UI.

---

## 2. Break Down into Iterative Chunks

Below is a set of larger chunks, each of which can then be subdivided further:

1. **Chunk A: Scaffolding & Basic Front-End Setup**
    - Create a new Vite + TypeScript project.
    - Integrate shadcn UI components.
    - Set up basic routing or layout structure (e.g., a main layout with a placeholder for the
      calendar).

2. **Chunk B: Calendar UI**
    - Implement a calendar component (weekly or monthly).
    - Allow basic click/drag to create a new time block.

3. **Chunk C: Modal & Activity Creation Flow**
    - Modal with minimal fields: Activity Name, Expected Difficulty, Expected Mood.
    - “More fields” section hidden behind a toggle.

4. **Chunk D: Storing & Retrieving Activities**
    - Set up a simple state management approach (Vue Context, Zustand, or Redux, etc.).
    - Maintain a list of activities in memory (later we can refine or integrate a real backend if
      needed).

5. **Chunk E: Post-Activity Feedback Mechanism**
    - When an activity ends, prompt the user for Actual Difficulty and Actual Mood.
    - Update the activity in the store with retrospective data.

6. **Chunk F: Visualization & Stats**
    - Display stats on the calendar and/or in a separate panel.
    - Simple calculations: average mood, difference between expected and actual difficulty, most
      common activity type, etc.

7. **Chunk G: Activity Presets & Quick Selection**
    - Provide a predefined list of activities for quick selection.
    - Ensure an easy way to insert them into the calendar.

8. **Chunk H: Polishing & UX Enhancements**
    - Smooth transitions, hover states, and UI feedback.
    - Additional styling to highlight completed or “overachieved” activities.
    - Responsive design considerations for different screen sizes.

---

## 3. Further Breakdown into Small Steps

We’ll now iterate further, taking each chunk and breaking it down into small, safely implementable
steps:

### Chunk A: Scaffolding & Basic Front-End Setup

1. **Initialize Vite + TypeScript Project**
    - Step 1A: Run `npm create vite@latest behavioural-activation --template vue-ts`.
    - Step 1B: Install dependencies (e.g., `npm install shadcn-ui`), following shadcn docs.

2. **Set Up shadcn and Basic Folder Structure**
    - Step 2A: Configure shadcn (e.g., theming, base styles).
    - Step 2B: Create a top-level `App` component with placeholders.

3. **Basic Routing/Structure**
    - Step 3A: Decide if you’ll use Vue Router or a single-page approach.
    - Step 3B: Set up a placeholder `<Header>` or `<Navigation>` if needed.

---

### Chunk B: Calendar UI

1. **Install or Integrate Calendar Library (If Using One)**
    - Step 1B: Evaluate libraries (e.g., FullCalendar, Vue Calendar, or a custom approach).

2. **Render Basic Calendar Structure**
    - Step 2B: Show a weekly view with days/hours.

3. **Enable Click/Drag**
    - Step 3B: Capture start/end time from the user’s mouse interaction.
    - Step 3C: Convert that captured time range into an “Activity block” to be passed to a creation
      flow.

---

### Chunk C: Modal & Activity Creation Flow

1. **Create a Reusable Modal Component**
    - Step 1C: Reuse shadcn or headless UI for a modal.
    - Step 1D: Provide minimal fields (Activity Name, Expected Difficulty, Expected Mood).

2. **Add “More Fields” Toggle**
    - Step 2C: Show advanced fields only after user clicks “More fields.”

3. **Submit/Cancel Logic**
    - Step 3C: On “Submit,” dispatch an action to store new activity data.
    - Step 3D: On “Cancel,” discard changes.

---

### Chunk D: Storing & Retrieving Activities

1. **Set Up State Management**
    - Step 1D: Decide on a library (Context API, Zustand, Redux, etc.).
    - Step 1E: Create a data model for activities (id, title, start time, end time, expected
      difficulty, expected mood, etc.).

2. **Write Utility Functions**
    - Step 2D: For adding, retrieving, updating activities.

3. **Render Activities on the Calendar**
    - Step 3D: Each activity from the state should appear in the calendar.

---

### Chunk E: Post-Activity Feedback Mechanism

1. **Check Activity End Times**
    - Step 1E: On an interval or on calendar refresh, see which activities have ended.
    - Step 1F: Mark them as “awaiting feedback.”

2. **Prompt for Feedback**
    - Step 2E: Display a modal or inline form that asks for Actual Difficulty, Actual Mood.

3. **Store Feedback**
    - Step 3E: Update the activity object with actual difficulty/mood.

---

### Chunk F: Visualization & Stats

1. **Basic Calculations**
    - Step 1F: Calculate average difference between expected and actual difficulty, etc.

2. **UI Representation**
    - Step 2F: Show stats on the sidebar or a separate page.
    - Step 2G: Possibly highlight “overachieved” activities in green, or show a small badge.

---

### Chunk G: Activity Presets & Quick Selection

1. **Preset Data**
    - Step 1G: Keep a JSON array of standard activities (title, typical difficulty, typical mood).

2. **Quick-Add UI**
    - Step 2G: A dropdown or clickable list in the modal that instantly fills the form with selected
      preset data.

---

### Chunk H: Polishing & UX Enhancements

1. **Refine UI States**
    - Step 1H: Add animations and transitions for modals and drag interactions.

2. **Responsive Design**
    - Step 2H: Use media queries or responsive breakpoints to ensure the calendar layout works on
      mobile/tablet.

3. **Testing & Accessibility**
    - Step 3H: Check for keyboard accessibility in modals, headings, color contrast, etc.

---

## 4. Final: Code Generation Prompts

Below are example prompts for a code-generation LLM. Each section is provided in **Markdown** with a
code fence of type `text` to differentiate them clearly as “prompts.” **You** would copy these
prompts into your code-generation environment sequentially (and feed in any existing code or context
needed from the previous step). Each prompt references the previous steps’ code so we can build
iteratively without leaving anything behind.

### Prompt A1: Initialize Vite + TypeScript Project

```
You are an expert software developer.

Step Goal:
Initialize a new Vite + TypeScript Vue project and set up the basic folder structure.

Tasks:

1. Run: npm create vite@latest behavioural-activation --template vue-ts
2. Navigate into the project folder, run npm install or yarn to install.
3. Create a minimal file/folder structure:
    - src/
        - components/
        - pages/
        - App.tsx
        - main.tsx

When you generate code, please provide the new or changed file contents. Only include what’s
necessary so that I can paste them into the project without conflicts.

Begin.
```

### Prompt A2: Configure shadcn and Basic Layout
```
You are an expert software developer.

Step Goal:

1. Install shadcn and any dependencies it requires.
2. Configure shadcn to provide a minimal layout (typography, some base components).
3. Create a basic <App> component that renders “Hello World” inside shadcn’s layout.

Instructions:

- Show me how to install shadcn, following the recommended steps from the official documentation.
- Provide me the updated package.json, tailwind.config.js (if used), postcss.config.js, and any
  config or devDependency changes.
- Provide a skeleton <App> component that demonstrates shadcn’s layout and one sample component.

Begin.
```

### Prompt B1: Calendar UI Skeleton

```
You are an expert software developer.

Step Goal:

1. Integrate a basic weekly calendar view in our existing project.
2. Use either a library (e.g., Vue Calendar) or a custom approach if you prefer.
3. Show how to set up the calendar so it appears on the main page.

Instructions:

- Provide dependencies needed for the chosen library in package.json.
- Show how to import and render the calendar in a new file, e.g., src/components/Calendar.tsx.
- Update <App> to include the calendar.


Begin.
```

### Prompt B2: Enable Click and Drag

```
You are an expert software developer.

Step Goal:
Extend the Calendar component to allow a user to click and drag to select a time range.

Instructions:

- If you’re using a third-party library, show me how to configure click-drag interactions.
- If you’re implementing custom logic, provide the relevant code for capturing mouse events and
  determining start/end times.
- Conclude by demonstrating how to console.log the selected time range so we can hook it into the
  next step.


Begin.
```

###  Prompt C1: Create Modal for New Activities

```
You are an expert software developer.

Step Goal:

1. Create a reusable Modal component using shadcn or a similar library.
2. Collect minimal fields: Activity Name, Expected Difficulty, Expected Mood.
3. Provide a “More fields” toggle with hidden fields (location, notes, participants, etc.).

Instructions:

- Show me how to import or create the Modal.
- Show the form fields, including the hidden advanced fields.
- Demonstrate how to handle the Submit and Cancel actions (for now, just console.log the data on
  Submit).


Begin.
```

### Prompt C2: Integrate Modal with Calendar

```
You are an expert software developer.

Step Goal:
When a user finishes click-dragging on the calendar, automatically pop up the new Modal with the
selected time range pre-filled (startTime, endTime).

Instructions:

- Show how to open the modal upon receiving the time range from the Calendar’s click-drag event.
- Insert the startTime/endTime into the modal’s state.
- On Submit, print out or store the final activity data in a placeholder store (we’ll refine it
  later).


Begin.
```

###  Prompt D1: Create Activity Store

```
You are an expert software developer.

Step Goal:
Set up a simple client-side store or state management solution (Context, Zustand, or Redux) to hold
an array of activities.

Instructions:

- Create an Activity interface (id, title, start, end, expectedDifficulty, expectedMood, etc.).
- Implement addActivity and getActivities methods.
- Show how to wrap the main <App> or <Calendar> with the provider so any component can access or
  modify the store.
- On the Modal Submit, save the new activity in the store.


Begin.
```

### Prompt D2: Render Activities on the Calendar

```
You are an expert software developer.

Step Goal:
Use the activities in our store to render them back onto the calendar, marking their time ranges.

Instructions:

- For each activity in the store, show how to display it as a block on the calendar.
- Include the title, possibly the expected mood, etc.
- If using a third-party calendar library, show how to add events to the calendar. If custom, show
  how you map each activity to the correct location in the UI.


Begin.
```

###  Prompt E1: Post-Activity Feedback

```
You are an expert software developer.

Step Goal:

1. Detect when an activity is past its scheduled end time.
2. Prompt the user for Actual Difficulty and Actual Mood.
3. Update the store with this feedback.

Instructions:

- Demonstrate either a polling approach (e.g., setInterval) or an onCalendarRefresh approach.
- Provide a feedback modal that appears for any activity that’s ended but has no actual
  difficulty/mood yet.
- Show how to update the store once the user confirms.


Begin.
```

### Prompt F1: Basic Stats and Visualization

```
You are an expert software developer.

Step Goal:
Display a simple statistics panel summarizing:

- Average difference between expected and actual difficulty
- Average improvement in mood
- Number of activities completed

Instructions:

- Create a new component <StatsPanel> that pulls data from the store.
- Implement basic calculations and show them in a simple UI (e.g., plain text or progress bars).
- Demonstrate hooking it into the main layout.


Begin.
```

### Prompt G1: Activity Presets

```
You are an expert software developer.

Step Goal:

1. Add a small library or JSON file of activity presets (e.g., “Brush teeth,” “Go for a run,”
   “Painting,” etc.).
2. Integrate them into the Modal so a user can select a preset, automatically filling in typical
   difficulty or mood.

Instructions:

- Create a constants file or JSON file with the presets.
- Provide a dropdown or clickable list in the new-activity modal.
- On selection, populate the form fields accordingly.


Begin.
```

###  Prompt H1: Finishing Touches & UX Polish

```
You are an expert software developer.

Step Goal:

1. Add final styling passes, transitions, and hover states to enhance the UI.
2. Make the layout responsive.
3. Ensure everything is tested for basic accessibility (tab navigation, ARIA labels, etc.).

Instructions:

- Show changes or additions to CSS, tailwind classes, or shadcn config.
- Provide code for any transitions on modals or calendar blocks.
- Summarize any accessibility features we should add.


Begin.
```

# Concluding Notes
Each prompt is self-contained but references the code built by previous steps. In practice, you’d
feed the code from each step to the LLM (or have it stored in your environment), then provide the
next prompt to refine or expand the existing codebase.
By the time you finish Prompt H1, you should have a functioning front-end application implementing
the entire user flow described in the high-level blueprint.
You can further refine or adapt these prompts based on the specific code-generation tool or
environment you’re using.
This plan and set of prompts ensure small, incremental progress, each step building on the previous,
with no unintegrated or “lost” code.