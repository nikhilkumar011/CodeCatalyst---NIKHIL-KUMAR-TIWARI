# 🚀 CodeCatalyst

An AI-powered PDF analysis platform built with **Next.js 16**, **Prisma**, **Better Auth**, **Google Gemini AI**, and **PostgreSQL**. Upload PDF documents, extract text, generate AI-powered insights, and create flashcards to enhance learning.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-316192?logo=postgresql)
![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?logo=google)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📌 Features

- 📄 Upload PDF documents
- 🔍 Extract text from PDFs
- 🤖 AI-powered document summarization
- 📝 Automatic flashcard generation
- ⚡ Key contributions extraction
- ⚠️ Limitations detection
- 🔐 Authentication with Better Auth
- 🌙 Dark & Light mode
- 📊 Personal dashboard
- 💾 Store uploaded files and generated insights
- 🎨 Modern responsive UI using Tailwind CSS & Framer Motion

---

## 🛠 Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- React Hot Toast

### Backend

- Next.js Route Handlers
- Better Auth
- Prisma ORM
- PostgreSQL (Neon)

### AI

- Google Gemini API

### PDF Processing

- pdf2json

### Deployment

- Vercel

---

# 📂 Folder Structure

```
app
├── api
│   ├── auth
│   ├── upload
│   ├── insights
│   └── upfiles
│
├── dashboard
├── login
├── signup
└── landingPage

components
lib
providers
prisma
public
```

---

# ⚙️ Environment Variables

Create a `.env` file.

```env
DATABASE_URL=

BETTER_AUTH_SECRET=

BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_GENERATIVE_AI_API_KEY=
```

For production, update

```env
BETTER_AUTH_URL=https://your-domain.vercel.app
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/CodeCatalyst.git
```

Go inside the project

```bash
cd CodeCatalyst
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Push schema to database

```bash
npx prisma db push
```

Run development server

```bash
npm run dev
```

Visit

```
http://localhost:3000
```

---

# 📖 How It Works

### 1. User Authentication

Users can

- Sign Up
- Login
- Google Sign In

using Better Auth.

---

### 2. Upload PDF

The user uploads a PDF document.

---

### 3. Text Extraction

The backend extracts all readable text using **pdf2json**.

---

### 4. Store Document

The extracted text is stored in PostgreSQL using Prisma.

---

### 5. AI Analysis

Google Gemini processes the extracted text and generates:

- Summary
- Key Contributions
- Limitations
- Flashcards

---

### 6. Dashboard

Users can revisit previously uploaded documents and AI-generated insights.

---

# 🗄 Database Schema

```
User
│
├── Sessions
├── Accounts
└── Uploaded Files
        │
        └── Output
              ├── Summary
              ├── Contributions
              ├── Limitations
              └── Flashcards
```

---

# 📸 Screenshots

> Add screenshots of your application here.

```
public/screenshots

home.png

dashboard.png

upload.png

insights.png

login.png
```

---

# 🔮 Future Improvements

- Support PDFs larger than serverless payload limits using object storage
- Chat with uploaded PDFs
- Vector database integration
- Semantic search
- Multi-document analysis
- Export AI notes
- Folder management
- OCR support for scanned PDFs
- AI Quiz Generator
- Citation generation
- PDF annotations

---

# 📦 Main Dependencies

```json
Next.js
React
TypeScript
Prisma
Better Auth
PostgreSQL
Google Gemini
pdf2json
Framer Motion
Zustand
Tailwind CSS
Lucide React
React Hot Toast
```

---

# 🧠 AI Features

- Document Summarization
- Flashcard Generation
- Contribution Detection
- Limitation Analysis

Powered by **Google Gemini**.

---

# 👨‍💻 Author

**Nikhil Kumar Tiwari**

GitHub: https://github.com/nikhilkumar011

LinkedIn: Add your LinkedIn profile

---

# ⭐ Show Your Support

If you found this project helpful,

⭐ Star this repository

🍴 Fork it

📢 Share it with others

---

# 📄 License

This project is licensed under the MIT License.
