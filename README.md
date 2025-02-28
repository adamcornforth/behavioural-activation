# Behavioral Activation App

A front-end application designed to facilitate Behavioral Activation (BA) therapy, helping users
plan and track activities, rate difficulty and mood impact, and visualize progress.

<img width="1384" alt="image" src="https://github.com/user-attachments/assets/7192839e-acb4-4820-bee5-fbaaefd144a2" />

## About This Project

This project was created using AI assistance, following a structured development approach:

1. A detailed specification document (`docs/spec.md`) outlining the requirements and features
2. A methodical prompt plan (`docs/prompt_plan.md`) breaking down the implementation into manageable
   chunks

## Core Features

- **Activity Management**: Create, schedule, and track time-bound activities
- **Calendar View**: Weekly view with drag-and-drop scheduling
- **Mood & Difficulty Tracking**: Rate expected vs. actual difficulty and mood impact
- **Activity Presets**: Quick selection of common activities
- **Stats & Progress Tracking**: Visualize trends and insights about your activities

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

- Data export functionality
- Cloud integration
- Mobile app version

## License

MIT
