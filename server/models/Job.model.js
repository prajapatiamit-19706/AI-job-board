import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    skills: [
      {
        type: String,
      },
    ],
    location: {
      type: String,
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      required: true,
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' },
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'draft'],
      default: 'open',
    },
    applicantCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
