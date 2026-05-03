import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['candidate', 'employer', 'admin'],
      default: 'candidate',
    },
    otp: {
      type: String,
      default: null
    },
    otpExpiresAt: {
      type: Date,
      default: null
    },
    resumeUrl: {
      type: String,
    },
    resumeText: {
      type: String,
    },
    companyName: {
      type: String,
    },
    companyLogo: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
