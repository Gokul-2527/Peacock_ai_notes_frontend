# AI Notes App Frontend (Next.js + TypeScript + TailwindCSS)

This is the **frontend** for the AI Notes App, built using **Next.js 16 App Router**, **TypeScript**, and **TailwindCSS**.  
It connects with the Hono.js backend API to provide user authentication, note management, and AI-powered features like summaries, improved content, and tag suggestions.

---

## Features

- **User Authentication**
  - Register new users
  - Login with JWT authentication
  - Stores token in `localStorage` or cookies
- **Notes Management**
  - Create, Read, Update, Delete (CRUD) notes
  - Notes displayed in cards with editable content
- **AI Integration**
  - Generate note summaries
  - Improve note content
  - Suggest tags
- **Dark Mode Support**
  - Toggle between light and dark themes
- **Search**
  - Global search for notes
- **Responsive Design**
  - Works on desktop and mobile screens

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Context for search
- **UI Components**: ShadCN UI, React Hot Toast
- **Authentication**: JWT
- **API Calls**: Axios
- **Theme Management**: `next-themes`

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/Peacock_ai_notes_frontend.git
cd Peacock_ai_notes_frontend/frontend

2. Install dependencies:
npm install

3.Configure environment variables:
NEXT_PUBLIC_API_URL=http://localhost:4000

4.Run the development server:
npm run dev


Folder Structure
frontend/
│
├─ app/                     # Next.js App Router pages
│   ├─ Home/                # Notes page
│   ├─ Auth/                # Login & Register pages
│   └─ layout.tsx           # Root layout with ThemeProvider & SearchProvider
├─ components/              # Reusable UI components (Header, Dialogs, Buttons, Modal)
├─ context/                 # React Context (search)
├─ envfile/                 # API & Axiosinstance configuration
├─ styles/                  # Global CSS
├─ tsconfig.json
├─ package.json
└─ .env.local



Register: POST /register → Accepts { name, email, password }

Login: POST /login → Accepts { email, password } → Returns JWT

Notes

GET /notes/get → Get all notes

POST /notes/create → Create note

PUT /notes/update/:id → Update note

DELETE /notes/delete/:id → Delete note

AI Features

POST /api/ai/summary/:noteId → Generate summary

POST /api/ai/improve/:noteId → Improve note

POST /api/ai/tags/:noteId → Generate tags
