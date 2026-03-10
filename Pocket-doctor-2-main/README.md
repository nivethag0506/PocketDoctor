# Pocket Doctor

Pocket Doctor is a modern,, AI-enhanced web application designed to help users manage their medications effectively. It provides a centralized dashboard for tracking schedules, an intelligent guide for medication information, and an AI assistant to answer health-related questions, simplifying the complexity of healthcare management.

## Core Features

*   **Personalized Medication Schedule:** Create and manage a custom medication schedule.
*   **Adherence Tracking:** Log daily doses as taken, skipped, or pending.
*   **AI-Powered Medication Guide:** Instantly look up detailed information for any medication.
*   **AI Conversational Assistant:** Get answers to your medication-related questions from an AI chatbot.
*   **Adherence Dashboard:** Visualize your medication adherence statistics through an intuitive dashboard.
*   **Responsive & Themed UI:** Enjoy a clean, modern interface with both light and dark themes.

## Technology Stack

*   **Frontend:**
    *   **Framework:** Next.js 15 (with App Router)
    *   **Language:** TypeScript
    *   **UI Library:** React 18
    *   **Styling:** Tailwind CSS
    *   **Component Library:** ShadCN UI
*   **Backend (integrated within Next.js):**
    *   **Runtime:** Node.js
    *   **AI Orchestration:** Genkit
*   **Other Tools:**
    *   **AI Provider:** Google AI
    *   **Icons:** Lucide React
    *   **Charts:** Recharts

## Development

1. Install deps: `npm install`
2. Run dev: `npm run dev`

### MongoDB setup

Create a `.env.local` in the project root with:

```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=pocket_doctor
```

Then seed the database (with dev server running):

```
GET http://localhost:9002/api/seed
```

The app loads users and patients from the API (`/api/users`, `/api/patients`).

## UI/UX Focus

*   **Clean and Modern:** The UI is designed to be minimal and clutter-free, using a professional color palette and ample white space.
*   **Component-Based:** Built with ShadCN UI components for a consistent and high-quality look and feel.
*   **Responsive:** The layout adapts smoothly to all screen sizes, from mobile phones to desktops.
*   **User-Centric:** Focuses on clarity and ease of use, with clear calls-to-action and intuitive navigation.
*   **Dark Mode:** Includes a fully-supported dark theme to reduce eye strain and cater to user preferences.
