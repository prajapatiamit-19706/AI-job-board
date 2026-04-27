import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    resumeUrl: {
        type: String,
        required: true,
    },
    resumePublicId: {
        type: String,
    },
    coverLetter: {
        type: String,
    },
    status: {
        type: String,
        enum: ['applied', 'shortlisted', 'interview', 'rejected', 'hired'],
        default: 'applied',
    },
    aiScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    aiSummary: {
        type: String,
    },
    aiSkillsMatched: {
        type: [String],
        default: [],
    },
    aiSkillsMissing: {
        type: [String],
        default: [],
    },
    aiScoredAt: {
        type: Date,
    },
    aiExperienceMatch: {
        type: String,
        enum: ['strong', 'moderate', 'weak'],
    },
    aiRecommendation: {
        type: String,
        enum: ['hire', 'consider', 'reject'],
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
});

applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
