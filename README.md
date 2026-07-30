# SOFC 2.0 - Code Catalyst

A modern document intelligence platform that uses AI to extract and analyze insights from PDF documents. Built with Next.js, Prisma, and Google's Generative AI.

## 📋 Project Overview

SOFC 2.0 Code Catalyst is an intelligent document processing application designed to:
- **Upload & Parse PDFs**: Seamlessly upload PDF documents and extract text content
- **AI-Powered Analysis**: Leverage Google's Gemini AI to analyze document content
- **Extract Insights**: Automatically extract structured data including summaries, key findings, technical details, recommendations, and confidence scores
- **User Authentication**: Secure user authentication and session management with BetterAuth
- **Database Storage**: PostgreSQL database for storing user data and documents

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- PostgreSQL database
- Google Generative AI API key

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:
```
DATABASE_URL=postgresql://user:password@localhost:5432/sofc2
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

### Development Server

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🏗️ Project Structure

```
app/
├── api/
│   ├── auth/              # Authentication endpoints (BetterAuth)
│   ├── upload/            # PDF upload and parsing endpoint
│   └── insights/          # AI-powered document analysis endpoint
├── login/                 # User login page
├── signup/                # User registration page
├── root/                  # Main dashboard layout
└── globals.css            # Global styles

lib/
├── auth.ts                # Authentication configuration
├── auth-client.ts         # Client-side auth utilities
└── db.ts                  # Database connection

prisma/
├── schema.prisma          # Database schema
└── migrations/            # Database migration history
```

## 🔧 Tech Stack

- **Frontend**: React 19.2.4 with Next.js 16.2.12
- **Styling**: Tailwind CSS 4 with PostCSS
- **Animation**: Framer Motion 12.43.0
- **Icons**: Lucide React 1.27.0
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM 7.9.1
- **Authentication**: BetterAuth 1.6.25
- **AI/ML**: Google Generative AI (@google/generative-ai)
- **PDF Processing**: pdf2json 4.0.3
- **Linting**: ESLint 9
- **Type Safety**: TypeScript 5

## 📚 Key Features

### PDF Upload & Processing (`/api/upload`)
- Accepts PDF files via multipart form data
- Extracts text content from PDFs using pdf2json
- Returns structured text for further analysis

### AI Document Analysis (`/api/insights`)
- Sends extracted text to Google Gemini AI
- Structured schema generation for consistent output
- Extracts:
  - **Summary**: Concise overview of the document
  - **Key Findings**: Main points and conclusions
  - **Technical Details**: Specifications and technical information
  - **Recommendations**: Suggested actions or improvements
  - **Confidence Score**: AI confidence in the analysis

### User Management
- Sign up and login functionality
- Secure session management
- User profile storage (name, email, image)
- Email verification support

## 🔐 Authentication

Uses **BetterAuth** for robust authentication:
- User registration and login
- Session management
- Password hashing and security
- Social authentication ready

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🌐 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/upload` | POST | Upload and parse PDF documents |
| `/api/insights` | POST | Get AI-powered analysis of document text |
| `/api/auth/[...all]` | ALL | Authentication endpoints (managed by BetterAuth) |

## 🗄️ Database Schema

### User Model
- id: string (primary key)
- name, email, emailVerified
- image, createdAt, updatedAt
- relations: sessions, accounts

### Session Model
- id, token, expiresAt
- ipAddress, userAgent
- userId (foreign key)

### Account Model
- OAuth/social login integration
- accountId, providerId
- userId (foreign key)

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy on Vercel
The easiest way to deploy is using [Vercel](https://vercel.com):
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Click deploy

See [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📝 Environment Variables

Required environment variables for `.env.local`:
```
DATABASE_URL              # PostgreSQL connection string
GOOGLE_GENERATIVE_AI_API_KEY  # Google AI API key (get from https://makersuite.google.com/app/apikey)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is part of the SOFC initiative.

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Google Generative AI API](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com)
- [BetterAuth Documentation](https://www.better-auth.com/)

---

**Last Updated**: July 30, 2026
