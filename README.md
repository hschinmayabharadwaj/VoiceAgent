# 🧠 ManasMitra: An AI-Powered Mental Wellness Companion

**ManasMitra** is a confidential and empathetic AI-powered mental wellness application designed to support users on their well-being journey.  
It provides a safe space for self-reflection, personalized encouragement, and access to supportive resources through multi-modal AI interaction.

---

## 🌿 Overview

ManasMitra goes beyond traditional chatbots — it’s built as an **Agentic AI System**, a network of specialized AI agents working collaboratively to enhance user mental wellness through proactive, context-aware, and emotionally intelligent support.

---

## ✨ Key Features

### 🏠 Dashboard  
A welcoming home screen that greets users personally and displays a unique, **AI-generated daily affirmation** to begin the day positively.

### 💭 Daily Check-in  
An intuitive, step-by-step flow allowing users to **log their mood and feelings**.  
The AI assistant provides **empathetic feedback** and suggests a **wellness resource** based on emotional state.

### 🗣️ Voice Agent  
An interactive, **voice-powered AI companion** offering empathetic, natural conversations using:
- Speech-to-text (via Web Speech API)
- Text-to-speech (Gemini 2.5 Flash Preview TTS)

### 🧘 Mindfulness Sessions  
Interactive guided meditation, breathing exercises, and mindful moments with customizable **duration and experience levels**.

### 📈 Progress Tracking  
Visual insights into mood trends over time to help users **recognize emotional patterns** and **celebrate growth**.

### 📚 Resource Hub  
A curated collection of **articles, exercises, and guides** on mindfulness, breathing, and emotional awareness.

### 🤝 Anonymous Support Forum  
A safe, **anonymous community space** for sharing experiences, offering peer support, and connecting with others.

---

## 🤖 Agentic AI System

### What Makes ManasMitra Agentic
- 🧩 **Autonomous Decision-Making:** Each AI agent independently decides responses based on user context.  
- 🎯 **Goal-Oriented Behavior:** All agents work toward improving user mental wellness.  
- 🧠 **Multi-Agent Collaboration:** Specialized agents handle tasks like affirmation, empathy, and recommendations.  
- 💬 **Proactive Engagement:** The system not only responds but also suggests helpful actions or content.  
- 🕊️ **Contextual Memory:** Maintains history and patterns for personalized interactions.  
- 🌱 **Adaptive Responses:** Adjusts tone and behavior based on user emotions.

---

## 🧩 Complete AI Agent Ecosystem

| **Agent** | **Purpose** | **Key Capabilities** |
|------------|-------------|----------------------|
| **1. Voice Agent** | Real-time voice conversations | Speech recognition, empathetic dialogue, self-reflection guidance, helpline escalation |
| **2. Chat Agent** | Text-based support | Emotional understanding, proactive suggestions, contextual flow |
| **3. Daily Affirmation Agent** | Generate uplifting affirmations | Personalized, psychology-based daily encouragement |
| **4. Empathetic Response Agent** | Handle daily check-ins | Emotional validation, personalized feedback |
| **5. Resource Recommendation Agent** | Suggest wellness resources | Context-aware recommendations based on user mood |
| **6. Story Analysis Agent** | Interpret user-created stories | Emotional insight through narrative analysis |
| **7. Choice Analysis Agent** | Analyze decisions in activities | Behavioral pattern recognition and self-awareness feedback |

### Agent Collaboration  
- ⚙️ **Action Layer:** Coordinates communication among agents  
- 🔁 **Context Sharing:** Shared memory of user interactions  
- 💖 **Unified Personality:** All agents reflect the same empathetic “ManasMitra” identity  
- 🚨 **Crisis Protocol:** Any agent can trigger professional helpline suggestions  

---
## 🧠 Voice Agent Architecture
User Speech Input
↓
Browser Speech Recognition API
↓
Text Transcription
↓
Voice Agent Flow (Gemini 2.5 Flash)
↓
AI Response Generation
↓
Text-to-Speech Flow (Gemini 2.5 Flash Preview TTS)
↓
Audio Generation & Playback
↓
User Hears Response


### 🎧 Voice Agent Features  
- Real-time bidirectional voice conversation  
- Emotional and contextual awareness  
- Conversation continuity and memory  
- Privacy-first (no permanent data storage)  
- Works across browsers supporting Web Speech API  
- Voice-first accessibility for users preferring speech  

---

## 🧘‍♀️ Therapeutic Design Principles

- **Non-directive:** No medical advice or diagnoses  
- **Validation-focused:** Recognizes and validates feelings  
- **Strength-based:** Highlights user resilience  
- **Gentle questioning:** Encourages self-reflection  
- **Hope-instilling:** Maintains a positive, supportive tone  

---

## 🛠️ Tech Stack

| **Layer** | **Technology** |
|------------|----------------|
| **Framework** | Next.js (App Router) |
| **Language** | TypeScript |
| **UI Library** | React |
| **Styling** | Tailwind CSS |
| **Components** | ShadCN UI |
| **Generative AI** | Firebase Genkit + Google’s Gemini Models |
| **Conversational AI** | Gemini 2.5 Flash (text) |
| **Voice Synthesis** | Gemini 2.5 Flash Preview TTS |
| **Speech Recognition** | Web Speech API (SpeechRecognition / webkitSpeechRecognition) |
| **Audio Handling** | WAV encoding & HTML5 Audio API |
| **Icons** | Lucide React |
| **State Management** | React Hooks + Context API |
| **Data Persistence** | Browser Local Storage |
| **Deployment** | Firebase App Hosting |

---

## 🧩 System Architecture Diagram

![ManasMitra Agentic AI Architecture](https://via.placeholder.com/1200x700.png?text=Agentic+AI+System+Architecture+Diagram)

*(Replace the above link with your actual architecture diagram image once ready.)*

---

## 🚀 Getting Started

### Prerequisites
- **Node.js v18+**
- **npm** (v9+ recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/manasmitra.git

# Navigate into the project directory
cd manasmitra

# Install dependencies
npm install

Run the Development Server
npm run dev


Then open http://localhost:9002 in your browser.

