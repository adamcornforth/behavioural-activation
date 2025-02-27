# todo.md

A checklist derived from the **Behavioral Activation App** blueprint. Each item is a task or
sub-task you can check off as you progress.

---

## Chunk A: Scaffolding & Basic Front-End Setup

1. **Initialize Vite + TypeScript Project**
    - [ ] **A1.1**: Run `npm create vite@latest my-therapy-app --template react-ts`
    - [ ] **A1.2**: Navigate into the project folder and install dependencies
    - [ ] **A1.3**: Create minimal file/folder structure:
        - [ ] `src/`
            - [ ] `components/`
            - [ ] `pages/`
            - [ ] `App.tsx`
            - [ ] `main.tsx`

2. **Set Up shadcn and Basic Folder Structure**
    - [ ] **A2.1**: Install `shadcn-ui` (or follow official instructions)
    - [ ] **A2.2**: Configure shadcn (base components, theming, typography)
    - [ ] **A2.3**: Create a top-level `<App>` component with placeholders

3. **Basic Routing/Structure**
    - [ ] **A3.1**: Decide on React Router or single-page approach
    - [ ] **A3.2**: Set up placeholders like `<Header>` or `<Navigation>` if needed

---

## Chunk B: Calendar UI

1. **Select/Install Calendar Library**
    - [ ] **B1.1**: Evaluate options (e.g., FullCalendar, React Big Calendar, custom)
    - [ ] **B1.2**: Add necessary dependencies to `package.json`

2. **Render Basic Calendar Structure**
    - [ ] **B2.1**: Create a `Calendar.tsx` (or similar) component
    - [ ] **B2.2**: Show weekly (or monthly) view with days/hours

3. **Enable Click/Drag to Create Time Blocks**
    - [ ] **B3.1**: Capture mouse events to detect start/end times
    - [ ] **B3.2**: Convert captured times into an "Activity block"
    - [ ] **B3.3**: (Optional) Log to console for testing

---

## Chunk C: Modal & Activity Creation Flow

1. **Create a Reusable Modal**
    - [ ] **C1.1**: Import/Create a modal using shadcn or headless UI
    - [ ] **C1.2**: Provide minimal fields: Activity Name, Expected Difficulty, Expected Mood
    - [ ] **C1.3**: Include a “More fields” toggle for optional fields (location, notes, etc.)

2. **Submit/Cancel Logic**
    - [ ] **C2.1**: Implement onSubmit to handle activity creation (currently just log data)
    - [ ] **C2.2**: onCancel discards changes and closes the modal

3. **Integrate Modal with Calendar**
    - [ ] **C3.1**: Trigger modal after click-drag on the calendar
    - [ ] **C3.2**: Pre-fill the modal with the selected start/end time
    - [ ] **C3.3**: Confirm activity creation (log or store the data)

---

## Chunk D: Storing & Retrieving Activities

1. **Set Up State Management**
    - [ ] **D1.1**: Choose a state management solution (Context, Zustand, Redux, etc.)
    - [ ] **D1.2**: Create an interface/shape for activities:
        - `id`, `title`, `start`, `end`, `expectedDifficulty`, `expectedMood`, etc.
    - [ ] **D1.3**: Implement `addActivity`, `getActivities`, etc.

2. **Link Modal with Store**
    - [ ] **D2.1**: On modal submit, store the new activity
    - [ ] **D2.2**: Confirm that the data persists in memory (or local storage)

3. **Render Activities on the Calendar**
    - [ ] **D3.1**: Retrieve activities from the store
    - [ ] **D3.2**: Display them in the calendar (title, color, etc.)

---

## Chunk E: Post-Activity Feedback Mechanism

1. **Check Activity End Times**
    - [ ] **E1.1**: Implement a check (interval, or on calendar load) to see which activities have
      ended
    - [ ] **E1.2**: Mark them as “awaiting feedback”

2. **Prompt for Actual Difficulty/Mood**
    - [ ] **E2.1**: Display a feedback modal/inline form for ended activities
    - [ ] **E2.2**: Submit the actual difficulty and mood

3. **Update the Store**
    - [ ] **E3.1**: Save the actual difficulty/mood to the existing activity object
    - [ ] **E3.2**: Optionally update the calendar display to show “completed”

---

## Chunk F: Visualization & Stats

1. **Basic Calculations**
    - [ ] **F1.1**: Compute average difference (expected vs. actual difficulty), average improvement
      in mood, etc.
    - [ ] **F1.2**: Tally completed activities, missed, etc.

2. **Display Stats**
    - [ ] **F2.1**: Create a `<StatsPanel>` or similar component
    - [ ] **F2.2**: Show stats (e.g., simple text, progress bars, badges)
    - [ ] **F2.3**: Highlight overachieved or high-mood activities in a positive manner

---

## Chunk G: Activity Presets & Quick Selection

1. **Preset Data**
    - [ ] **G1.1**: Create a JSON file or constants with typical activities (e.g., “Brush teeth,”
      “Go for a run,” “Painting,” etc.)

2. **Integrate with Modal**
    - [ ] **G2.1**: Provide a dropdown or list to select presets
    - [ ] **G2.2**: Upon selection, populate the modal fields with typical difficulty/mood

---

## Chunk H: Polishing & UX Enhancements

1. **Refine UI States**
    - [ ] **H1.1**: Add animations/transitions for the modal and activity blocks
    - [ ] **H1.2**: Add hover states or highlights for better interactivity

2. **Responsive Design**
    - [ ] **H2.1**: Use media queries or utility classes to ensure the calendar is readable on
      mobile/tablet
    - [ ] **H2.2**: Test across various screen sizes

3. **Testing & Accessibility**
    - [ ] **H3.1**: Ensure keyboard navigation works properly (tab focus, ARIA labels)
    - [ ] **H3.2**: Check color contrast and legibility
    - [ ] **H3.3**: Optionally incorporate automated testing (Jest, Cypress, etc.)

---

## Reminder

- Check off items as you complete them to track progress.
- Each chunk builds on the previous chunk’s code. Avoid jumping ahead before finishing any
  dependencies.
- Keep an eye on the user experience—each step should remain simple, encouraging usage and
  reinforcing positive behavior.

