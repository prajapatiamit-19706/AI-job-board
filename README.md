# ⚡ AI Job Board — MERN Stack + Groq AI

> A full-stack intelligent job platform where AI scores resumes, generates interview prep questions, and delivers real-time notifications — built to production standard.

[![Live Demo](https://img.shields.io/badge/Live-Demo-7C3AED?style=for-the-badge&logo=vercel&logoColor=white)](https://your-vercel-url.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-1D9E75?style=for-the-badge&logo=render&logoColor=white)](https://your-render-url.onrender.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-MIT-A78BFA?style=for-the-badge)](LICENSE)

---

## 📸 Screenshots

> _Add your screenshots here_

| Jobs Listing | AI Score Card | Admin Dashboard |
|---|---|---|
| ![Jobs](./screenshots/jobs.png) | ![Score](./screenshots/score.png) | ![Admin](./screenshots/admin.png) |

---

## 🧠 What Makes This Different

Most job boards are just CRUD apps. This one has a brain.

When a candidate applies, the platform automatically:

1. Extracts text from their PDF resume using `pdf-parse`
2. Sends it to **Groq LLaMA 3.3 70B** alongside the job description
3. Returns a structured match score with skill analysis
4. Auto-generates **10 personalized interview prep questions** for the candidate
5. Pushes real-time updates to both employer and candidate via **Socket.io**

No manual action required from anyone. The entire AI pipeline runs in the background.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                       │
│  Jobs Listing · Employer Dashboard · Candidate Dashboard    │
│  Admin Analytics · Real-time Notifications · PDF Export     │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP + WebSocket
┌─────────────────────▼───────────────────────────────────────┐
│                    SERVER (Express)                         │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │   Jobs   │  │  Apply   │  │  Admin   │   │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Background AI Pipeline                  │   │
│  │                                                     │   │
│  │  pdf-parse → Groq AI → Score → Interview Questions  │   │
│  │       ↓                    ↓              ↓         │   │
│  │   Extract              Save to DB    Notify via     │   │
│  │   Resume Text          Application   Socket.io      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   MONGODB ATLAS                             │
│  Users · Jobs · Applications · Notifications · Questions    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Core User Flows

### Candidate Application Flow

```
Candidate                    Server                      AI Pipeline
    │                          │                              │
    │── Upload Resume (PDF) ──▶│                              │
    │                          │── Save to Cloudinary ──────▶ │
    │                          │── Create Application ──────▶ │
    │◀─ "Applied!" (instant) ──│                              │
    │                          │                              │
    │                          │── triggerAIScoring() ───────▶│
    │                          │   (fire & forget)            │── pdf-parse ──▶ text
    │                          │                              │── Groq API ───▶ score
    │                          │                              │── Save score
    │                          │                              │── Emit socket
    │◀─ "AI Score Ready!" ─────│◀─────────────────────────────│
    │                          │                              │
    │                          │── triggerInterviewGen() ────▶│
    │                          │   (fire & forget)            │── Groq API ───▶ 10 Qs
    │                          │                              │── Save questions
    │                          │                              │── Notify candidate
    │◀─ "Prep Questions Ready!"│◀─────────────────────────────│
```

### AI Resume Scoring Pipeline

```
PDF Resume (Cloudinary URL)
        │
        ▼
  pdf-parse extracts text
        │
        ▼
  Truncate to 3000 chars
        │
        ▼
  Build Groq prompt with:
  ├── Job title + description
  ├── Required skills
  └── Resume text
        │
        ▼
  Groq LLaMA 3.3 70B
        │
        ▼
  Parse JSON response:
  ├── score: 0-100
  ├── summary: 2 sentences
  ├── skillsMatched: []
  ├── skillsMissing: []
  ├── experienceMatch: strong|moderate|weak
  └── recommendation: hire|consider|reject
        │
        ▼
  Save to Application document
        │
        ▼
  Socket.io emit → employer UI updates live
```

### Interview Question Generation

```
AI Score Saved
      │
      ▼
triggerInterviewGeneration()
      │
      ▼
Build Groq prompt with:
├── Job description + skills
├── Candidate's matched skills  ──▶  4 Technical Questions
├── Candidate's missing skills  ──▶  3 Gap-based Questions
└── Role + responsibilities     ──▶  3 Behavioral Questions
      │
      ▼
10 structured questions:
{ question, category, difficulty, purpose, hint }
      │
      ▼
Save to InterviewQuestion collection
      │
      ├──▶ Socket.io notify candidate
      └──▶ Notification: "Prep questions ready!"
```

---

## ✨ Features

### 🤖 AI Features
- **Resume Scoring** — Groq LLaMA 3.3 70B scores resumes 0–100 against job descriptions
- **Skill Gap Analysis** — identifies matched and missing skills per candidate
- **Interview Prep Generator** — auto-generates 10 tailored questions per candidate
- **Smart Recommendations** — hire / consider / reject signals for employers

### 👥 Role-Based System
| Feature | Candidate | Employer | Admin |
|---|---|---|---|
| Browse & apply to jobs | ✅ | ❌ | ✅ |
| View AI match score | ✅ | ✅ | ✅ |
| Post & manage jobs | ❌ | ✅ | ✅ |
| View all applicants | ❌ | ✅ | ✅ |
| Change application status | ❌ | ✅ | ✅ |
| Interview prep questions | ✅ | ❌ | ✅ |
| Platform analytics | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

### ⚡ Real-time Features
- Socket.io notifications for every key event
- Live AI score appears on employer's screen without refresh
- Unread notification badge with instant updates
- Application status changes pushed to candidate immediately

### 📊 Admin Dashboard
- Total users, jobs, applications at a glance
- Applications per day chart (Recharts AreaChart)
- User management with activate/deactivate
- Platform-wide job overview

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework with fast HMR |
| Tailwind CSS v3 | Utility-first styling with custom design tokens |
| Zustand | Auth state management |
| React Query | Server state, caching, mutations |
| React Router v6 | Client-side routing + protected routes |
| Socket.io-client | Real-time WebSocket connection |
| Recharts | Admin analytics charts |
| jsPDF | PDF export for interview questions |
| date-fns | Date formatting |
| Axios | HTTP client with JWT interceptor |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database + ODM |
| JWT + bcrypt | Authentication + password hashing |
| Socket.io | Real-time bidirectional events |
| Cloudinary | PDF resume + file storage |
| Nodemailer | Email notifications |
| pdf-parse | Extract text from PDF resumes |
| Groq SDK | AI resume scoring + question generation |
| Multer | File upload middleware |

### AI & Infrastructure
| Service | Usage |
|---|---|
| Groq (LLaMA 3.3 70B) | Resume scoring + interview question generation |
| MongoDB Atlas | Cloud database (M0 free tier) |
| Cloudinary | Resume PDF storage |
| Vercel | Frontend deployment |
| Render | Backend deployment |

---

## 📁 Project Structure

```
ai-job-board/
│
├── client/                          # React frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js     # JWT auto-injected axios
│   │   ├── components/
│   │   │   ├── common/              # Navbar, ProtectedRoute, Toast
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── NotificationBell.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── employer/            # AIScoreCard, ApplicantsView
│   │   │   │   └── AIScoreCard.jsx
│   │   │   └── candidate/           # AIScoreSummary, InterviewPrepCard
│   │   │       └── InterviewPrepCard.jsx
│   │   ├── hooks/                   # React Query hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useJobs.js
│   │   │   ├── useApplications.js
│   │   │   ├── useNotifications.js
│   │   │   ├── useSocket.js
│   │   │   └── useInterviewQuestions.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── JobDetail.jsx
│   │   │   ├── employer/
│   │   │   │   ├── EmployerDashboard.jsx
│   │   │   │   └── ApplicantsView.jsx
│   │   │   ├── candidate/
│   │   │   │   └── CandidateDashboard.jsx
│   │   │   └── admin/
│   │   │       └── AdminDashboard.jsx
│   │   ├── store/
│   │   │   ├── authStore.js         # Zustand auth store
│   │   │   └── toastStore.js        # Zustand toast store
│   │   └── utils/
│   │       └── exportInterviewPDF.js
│   ├── tailwind.config.js           # Custom design tokens
│   └── .env.example
│
└── server/                          # Express backend
    ├── config/
    │   ├── db.js                    # MongoDB connection
    │   ├── cloudinary.js            # Cloudinary setup
    │   └── socket.js                # Socket.io singleton
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── job.controller.js
    │   ├── application.controller.js
    │   ├── interview.controller.js
    │   ├── notification.controller.js
    │   └── admin.controller.js
    ├── middleware/
    │   ├── auth.middleware.js        # JWT verify
    │   ├── role.middleware.js        # Role guard
    │   └── upload.middleware.js      # Multer + Cloudinary
    ├── models/
    │   ├── User.model.js
    │   ├── Job.model.js
    │   ├── Application.model.js      # Includes all AI fields
    │   ├── InterviewQuestion.model.js
    │   └── Notification.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── job.routes.js
    │   ├── application.routes.js
    │   ├── interview.routes.js
    │   ├── notification.routes.js
    │   └── admin.routes.js
    ├── utils/
    │   ├── aiScorer.js              # Groq resume scoring
    │   ├── pdfExtract.js            # pdf-parse wrapper
    │   ├── scoreJob.js              # Background AI pipeline
    │   ├── interviewGenerator.js    # Interview question AI
    │   ├── email.js                 # Nodemailer templates
    │   └── notify.js               # Notification + socket emit
    ├── server.js
    └── .env.example
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local) or MongoDB Atlas account
- Groq API key — free at [console.groq.com](https://console.groq.com)
- Cloudinary account — free at [cloudinary.com](https://cloudinary.com)
- Gmail account for Nodemailer

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-job-board.git
cd ai-job-board
```

### 2. Setup Backend

```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-job-board
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password
```

```bash
npm run dev
# Server running on http://localhost:5000
```

### 3. Setup Frontend

```bash
cd ../client
npm install
cp .env.example .env
```

Fill in `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
# Frontend running on http://localhost:5174
```

### 4. Create Admin Account

```bash
cd server
node seedAdmin.js
# Email:    admin@jobboard.com
# Password: admin123
```

---

## 🌐 Deployment

### MongoDB Atlas
1. Create free M0 cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Network Access → Add IP `0.0.0.0/0`
3. Copy connection string → paste as `MONGO_URI`

### Backend on Render
1. New Web Service → connect GitHub repo
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all environment variables from `server/.env`

### Frontend on Vercel
1. Import repo at [vercel.com](https://vercel.com)
2. Root directory: `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add: `VITE_API_URL=https://your-render-url.onrender.com`

---

## 🔑 Environment Variables

### Server

| Variable | Description | Required |
|---|---|---|
| `PORT` | Server port (default 5000) | ✅ |
| `MONGO_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | JWT signing secret | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |
| `GROQ_API_KEY` | Groq API key (free) | ✅ |
| `EMAIL_USER` | Gmail address for notifications | ✅ |
| `EMAIL_PASS` | Gmail app password | ✅ |

### Client

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Backend API URL | ✅ |

---

## 📡 API Reference

### Auth
```
POST   /api/auth/register     Register new user (candidate/employer)
POST   /api/auth/login        Login and get JWT token
GET    /api/auth/me           Get current user (requires auth)
```

### Jobs
```
GET    /api/jobs              List all open jobs (public, supports search/filter/pagination)
GET    /api/jobs/:id          Get single job detail (public)
POST   /api/jobs              Create job (employer only)
PUT    /api/jobs/:id          Update job (employer only, own jobs)
PATCH  /api/jobs/:id/close    Close job (employer only)
DELETE /api/jobs/:id          Delete job (employer only)
GET    /api/jobs/employer/my  Get employer's own jobs
```

### Applications
```
POST   /api/applications/:jobId      Apply to job (candidate, multipart/form-data)
GET    /api/applications/my          Candidate's own applications
GET    /api/applications/job/:jobId  All applicants for a job (employer)
PATCH  /api/applications/:id/status  Update application status (employer)
DELETE /api/applications/:id         Withdraw application (candidate)
```

### Interview Questions
```
GET    /api/interviews/candidate/:applicationId   Candidate's prep questions
```

### Notifications
```
GET    /api/notifications           Get all notifications
GET    /api/notifications/unread    Get unread count
PATCH  /api/notifications/:id/read  Mark single as read
PATCH  /api/notifications/read-all  Mark all as read
```

### Admin
```
GET    /api/admin/stats              Platform statistics
GET    /api/admin/applications-chart Applications per day (14 days)
GET    /api/admin/users              All users
GET    /api/admin/jobs               All jobs
PATCH  /api/admin/users/:id/toggle   Toggle user active status
```

---

## 🧪 AI Scoring Guide

The AI scoring system uses the following scale:

| Score | Label | Recommendation |
|---|---|---|
| 85 – 100 | Excellent match | Hire |
| 70 – 84 | Good match | Hire |
| 50 – 69 | Moderate match | Consider |
| 30 – 49 | Weak match | Consider |
| 0 – 29 | Poor match | Reject |

Each score includes:
- **Matched skills** — technologies the candidate knows
- **Missing skills** — gaps vs job requirements
- **Experience match** — strong / moderate / weak
- **AI summary** — 2-sentence human-readable assessment

---

## 🎯 Interview Question Distribution

For every candidate application, 10 questions are auto-generated:

```
4 Technical   ──▶ Based on job skills + candidate's matched skills
               ──▶ Difficulty scales with AI score (80+ = harder)

3 Behavioral  ──▶ Based on role level and responsibilities
               ──▶ Medium difficulty

3 Gap-based   ──▶ Specifically targets candidate's missing skills
               ──▶ Probes how candidate would learn or handle gaps
```

---

## 🔔 Notification Events

| Event | Recipient | Trigger |
|---|---|---|
| `application_received` | Employer | Candidate applies |
| `status_changed` | Candidate | Employer updates status |
| `ai_scored` | Candidate | AI scoring completes |
| `ai_scored` | Candidate | Interview questions ready |

All notifications are delivered via **Socket.io** in real-time and persisted in MongoDB. Auto-deleted after 30 days via MongoDB TTL index.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Amit Prajapati**
- GitHub: [@amitprajapati](https://github.com/amitprajapati)
- LinkedIn: [Amit Prajapati](https://linkedin.com/in/amitprajapati)
- Email: your@email.com

---

## ⭐ Show Your Support

If this project helped you or gave you ideas, please consider giving it a star ⭐

It helps others discover the project and motivates continued development!

---

<div align="center">

**Built with ❤️ using MERN Stack + Groq AI**

_React · Node.js · Express · MongoDB · Groq LLaMA 3.3 70B · Socket.io · Tailwind CSS_

</div>