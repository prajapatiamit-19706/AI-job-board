# AI Job Board — MERN + Groq AI

## Live Demo
- Frontend: [your vercel url]
- Backend: [your render url]

## Tech Stack
- Frontend: React 18, Vite, Tailwind CSS, Zustand, React Query, Socket.io-client, Recharts
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Socket.io, Cloudinary, Nodemailer
- AI: Groq API (LLaMA 3.3 70B) for resume scoring
- Deployment: Vercel (frontend) + Render (backend) + MongoDB Atlas (database)

## Features
- Role-based auth: Candidate, Employer, Admin
- AI resume scoring with match percentage, skills analysis, recommendations
- Real-time notifications via Socket.io
- PDF resume upload via Cloudinary
- Email notifications via Nodemailer
- Admin analytics dashboard with charts

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key (free at console.groq.com)
- Cloudinary account (free)

### Backend
```bash
cd server
npm install
cp .env.example .env
# fill in your env values
npm run dev
```

### Frontend
```bash
cd client
npm install
cp .env.example .env
# set VITE_API_URL=http://localhost:5000
npm run dev
```

## Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GROQ_API_KEY=gsk_...
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

### client/.env
```
VITE_API_URL=http://localhost:5000
```

## Deployment

### MongoDB Atlas
1. Create free M0 cluster at mongodb.com/atlas
2. Add IP 0.0.0.0/0 to network access
3. Copy connection string to MONGO_URI

### Backend on Render
1. New Web Service → connect GitHub repo
2. Root directory: server
3. Build command: npm install
4. Start command: node server.js
5. Add all env variables from server/.env

### Frontend on Vercel
1. Import GitHub repo on vercel.com
2. Root directory: client
3. Build command: npm run build
4. Output directory: dist
5. Add env variable: VITE_API_URL=https://your-render-url.onrender.com
