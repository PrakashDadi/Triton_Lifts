# 🏋️‍♂️ Triton Lifts – AI-Powered Fitness Tracker

Triton Lifts is a cross-platform React Native fitness app designed to help users log workouts, track progress by muscle group, and receive AI-driven suggestions for improvement. It integrates Supabase for backend and authentication and uses the Gemini API for generating smart workout advice and visuals.

---

## 🚀 Features

- 📊 Dashboard with visual summaries of muscle group volume
- 🔍 Expandable logs showing workout history with weight, reps, and volume
- 💬 AI Chatbot (TritonChat) for customized fitness tips
- 🎙️ Voice-to-text support for asking fitness questions
- 🌐 Heatmap generation of trained muscles using Gemini API + image rendering
- 🔐 User authentication and cloud data storage via Supabase

---

## 🧰 Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Supabase (PostgreSQL, Auth, REST API)
- **AI Integration**: Google Gemini 2.0 Flash API
- **UI Tools**: React Native Paper, FlatList, custom styles
- **Data Visualization**: Custom progress bars for volume tracking

---

## 📁 Project Structure

/front-end ├── components/ │ ├── Dashboard.jsx # Main page with muscle logs and graphs │ ├── TritonChat.jsx # AI chatbot and heatmap visualizer │ ├── SelectExercises.jsx # For choosing and logging workouts │ ├── StartWorkout.jsx # Logs sets/reps/weights per workout ├── supabaseclient.js # Supabase client config ├── App.js # Navigation + root component ├── UserContext.js # Context to store logged-in user ├── .env # API keys and secrets


---

## ⚙️ Setup Instructions

### 🔑 Prerequisites
- Node.js and npm
- Expo CLI: `npm install -g expo-cli`
- Supabase project with tables: `User_Workouts`, `User_Details`
- Google Gemini API key

### 🧪 Local Setup

1. **Clone the repo:**
```bash
git clone https://github.com/PrakashDadi/Triton_Lifts.git
cd Triton_Lifts/front-end

npm install

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key

**Run The Application**
npx expo start

Schemas !!
![image](https://github.com/user-attachments/assets/f5cafa8f-6c7b-44d4-afb7-aaf912a6b571)

![image](https://github.com/user-attachments/assets/95c50567-e86c-4688-a6ea-a0d27327f1e2)

