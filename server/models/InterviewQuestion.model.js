import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  category: { type: String, enum: ['technical', 'behavioral', 'gap-based'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  purpose: { type: String },
  hint: { type: String }
});

const interviewQuestionSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true, unique: true },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [questionSchema],
  aiScore: { type: Number },
  generatedAt: { type: Date, default: Date.now },
  regeneratedCount: { type: Number, default: 0 }
});

export default mongoose.model('InterviewQuestion', interviewQuestionSchema);
