# Behavioral Activation App

A front-end application designed to facilitate Behavioral Activation (BA) therapy, helping users
plan and track activities, rate difficulty and mood impact, and visualize progress.

The project is hosted here: https://adamcornforth.github.io/behavioural-activation/

## About This Project

This project was created using AI assistance, following a structured "prompt engineering" approach.

The purpose of this project was (possibly quite clearly!) out of personal interest, but also to test
out using LLMs (like ChatGPT) to build project specs for feeding to other LLMs (like Claude code) to
help develop features.

The output is remarkable, and the scaffolding / prototyping is fast, but it remains to be seen if
the product is maintainable, or even understandable to other LLMs that haven't been built up with
the same context!

### The idea

This is from the [initial prompt](docs/initial-prompt.md).

> I want to create a front end only app (probably Vite + TS + shadcn), that facilitates someone trying
to use the therapy technique "Behavioral activation". It should show a calendar view where the
purpose is to plan out your activities for the week, and for you to predict how hard you think they
will be, and what you think their impact on your mood will be.
>
> The friction for creating activities should be extremely low, so you should be able to click and
drag on the calendar view to block out time for the activities, and the modal that appears for
putting details in should have as few inputs on it as possible. Most likely just "Activity name" "
Expected Difficulty" and "Expected Mood". Any additional fields like location, notes, participants,
activity type, notes, etc, should be hidden behind a "more fields" option and be totally optional.
>
> Another feature should be that when activities have passed, the app should ask you how hard you
actually found the activity, and the impact it actually had on your mood. The idea here is that the
app should help you prove to yourself that planning out activities and then actually carrying them
out improves your mood, and makes you more likely to do more activities in the future. So when you
mark activities as complete and your expectations on difficulty and mood are surpassed, the calendar
view should show that clearly, with the intention to motivate users to plan more activities and feel
good about their progress.
>
> When creating activities, there should be basic presets so that people don't get mental block when
planning. Basic stuff like "Brush teeth", to harder things like "Go for a run", social things like "
Movie night", creative things like "Painting", "Crafting" or "Listen to music", relaxing things
like "Baths", etc.
>
> There should also be stats that show what sort of activities make you feel happiest, which ones you
found easiest, easier than expected, etc. It should focus on the positivies. The idea is to
encourage people to break cycles of avoidance and inactiviy. That is easier if the app gives a sense
of achievement, and the barriers to planning are LOW.

### Prompt engineering

The idea text above was passed to an LLM with the prompt:

> Ask me one question at a time so we can develop a thorough, step-by-step spec for this idea. Each
question should build on my previous answers, and our end goal is to have a detailed specification I
can hand off to a developer. Let’s do this iteratively and dig into every relevant detail. Remember,
only one question at a time.
> 
> Here's the idea: [idea text]

With my input, it produced: 

1. A [prompt plan](docs/prompt_plan.md) breaking down the implementation into chunks.
2. A [specification document](docs/spec.md) outlining the requirements and features.

## Core Features

### Calendar planning

- **Activity Management**: Create, schedule, and track time-bound activities
- **Calendar View**: Weekly view with drag-and-drop scheduling
- **Activity Presets**: Quick selection of common activities

<img width="1384" alt="image" src="https://github.com/user-attachments/assets/7192839e-acb4-4820-bee5-fbaaefd144a2" />

### Activity stats

- **Mood & Difficulty Tracking**: Rate expected vs. actual difficulty and mood impact
- **Stats & Progress Tracking**: Visualize trends and insights about your activities

<img width="1362" height="653" alt="image" src="https://github.com/user-attachments/assets/b3499c8c-a5e3-4bbc-b49b-0f4c9890aa8a" />

### Mobile view

<img width="387" height="638" alt="image" src="https://github.com/user-attachments/assets/e1a97493-e59e-4329-8e17-fce15c765612" />

- **Day-only view**: Mobile version of the calendar

## Technology Stack

- **Vite**: For fast development and optimized builds
- **Vue 3 + TypeScript**: For type-safe, component-based UI development
- **Shadcn UI**: For reusable UI components
- **TailwindCSS**: For styling and design
- **Local Storage**: For persisting user data

## Getting Started

 ```bash                                                                                                                                                              
 # Install dependencies                                                                                                                                               
 npm install                                                                                                                                                          
                                                                                                                                                                      
 # Start development server                                                                                                                                           
 npm run dev                                                                                                                                                          
                                                                                                                                                                      
 # Build for production                                                                                                                                               
 npm run build                                                                                                                                                        
 ```                                                                                                                                                                  

## Project Structure

- `src/components/`: UI components including Calendar and activity modals
- `src/store/`: State management for activities
- `src/data/`: Activity presets and other static data
- `src/pages/`: Page components
- `docs/`: Project documentation including specification and prompt plan

## Future Enhancements

- [ ] Data export functionality
- [ ] Cloud integration
- [ ] Mobile app version

## License

MIT
