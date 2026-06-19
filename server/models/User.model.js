import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },        // B.Sc, B.Tech, MBA
  field: { type: String, required: true },          // Computer Science, IT
  institution: { type: String, required: true },    // HNGU, GTU
  startYear: { type: Number },
  endYear: { type: Number },
  grade: { type: String },                          // 8.5 CGPA / 75%
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },          // Frontend Developer
  company: { type: String, required: true },        // Infosys
  location: { type: String },                       // Ahmedabad
  startDate: { type: String },                      // "2023-06"
  endDate: { type: String },                        // "2024-01" or null if current
  isCurrent: { type: Boolean, default: false },
  description: { type: String },                    // what you did
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  techStack: [{ type: String }],                    // ["React", "Node.js"]
  liveUrl: { type: String },
  githubUrl: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    // ── existing fields (unchanged) ──────────────────────────────
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['candidate', 'employer', 'admin'],
      default: 'candidate',
    },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    resumeUrl: { type: String },
    resumeText: { type: String },
    companyName: { type: String },
    companyLogo: { type: String },
    isVerified: { type: Boolean, default: false },

    // ── new candidate profile fields ─────────────────────────────
    avatar: { type: String },                        // Cloudinary URL
    headline: { type: String },                      // "MERN Stack Developer"
    bio: { type: String },                           // short about me
    phone: { type: String },
    location: { type: String },                      // "Ahmedabad, Gujarat"
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    },

    // online presence
    portfolioUrl: { type: String },
    githubUrl: { type: String },
    linkedinUrl: { type: String },

    // skills — simple string array for now
    skills: [{ type: String }],                      // ["React", "Node.js", "MongoDB"]

    // structured sub-docs
    education: [educationSchema],
    experience: [experienceSchema],
    projects: [projectSchema],

    // job preferences
    expectedSalary: { type: String },               // "4-6 LPA"
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'freelance'],
    },
    availableFrom: { type: Date },
    isOpenToWork: { type: Boolean, default: true },

    // profile completion
    profileCompletionScore: { type: Number, default: 0 }, // 0-100
  },
  { timestamps: true }
);

// ── auto-calculate profile completion before save ─────────────────
userSchema.pre('save', function () {
  if (this.role !== 'candidate') return;

  const fields = [
    this.avatar,
    this.headline,
    this.bio,
    this.phone,
    this.location,
    this.skills?.length > 0,
    this.education?.length > 0,
    this.resumeUrl,
    this.githubUrl || this.portfolioUrl,
    this.linkedinUrl,
  ];

  const filled = fields.filter(Boolean).length;
  this.profileCompletionScore = Math.round((filled / fields.length) * 100);
});

const User = mongoose.model('User', userSchema);
export default User;