# Triathlon Training Analysis Dashboard Blueprint

## Overview
A modern, high-performance web application designed for triathletes to track and analyze their swimming, cycling, and running training sessions. The app provides visual insights into training volume, performance trends, and an integrated AI Coach for personalized training advice.

## Features & Style
- **Visual Design:**
  - Modern, mobile-responsive layout with a dashboard feel.
  - OKLCH color palette: Blue (Swim), Orange (Bike), Green (Run), Purple (AI Coach).
  - High-depth shadows and subtle textures for a premium aesthetic.
  - Interactive icons and smooth transitions.
- **Functional Features:**
  - **Dashboard:** Real-time summary of training volume and Chart.js visualizations.
  - **Activity Logging:** Support for Swim, Bike, and Run with specialized metrics.
  - **History:** Searchable/filterable list of past sessions.
  - **AI Coach (New):** An interactive assistant that analyzes your training data to provide performance insights and answer training-related questions.
  - **Data Persistence:** LocalStorage for session-based tracking.

## Technology Stack
- Framework-less HTML/CSS/JavaScript.
- Web Components for UI encapsulation.
- Modern CSS (Container Queries, `:has()`, Cascade Layers).
- Chart.js for visualizations.
- Lucide Icons for iconography.

## Current Plan: AI Assistant Integration
1.  **UI Updates:** 
    - Add "AI Coach" button to the sidebar in `index.html`.
    - Create a dedicated `view-ai` container.
2.  **AI Component:** 
    - Implement `components/AIAssistant.js` Web Component.
    - Feature a chat interface (input + message history).
    - Logic to analyze `store.js` data and generate "coaching" responses.
3.  **Styling:** 
    - Add specific styles for the chat bubble, AI persona, and interactive elements.
4.  **Integration:**
    - Update `main.js` to handle navigation to the AI view.
    - Ensure the AI can access current training stats for context-aware answers.
