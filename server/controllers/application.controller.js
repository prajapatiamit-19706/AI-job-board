import Application from '../models/Application.model.js';
import Job from '../models/Job.model.js';
import { uploadToCloudinary } from '../middleware/upload.middleware.js';
import { sendStatusEmail } from '../utils/email.js';
import { triggerAIScoring } from '../utils/scoreJob.js';
import { createNotification } from '../utils/notify.js';
export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const candidateId = req.user._id;

    const existingApplication = await Application.findOne({ candidate: candidateId, job: jobId });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'Already applied to this job' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Job is no longer open' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resume is required' });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);

    const application = new Application({
      candidate: candidateId,
      job: jobId,
      resumeUrl: uploadResult.url,
      resumePublicId: uploadResult.public_id,
      coverLetter: req.body.coverLetter || '',
    });

    await application.save();

    await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } });
    console.log('Firing AI scoring for application:', application._id)
    triggerAIScoring(application._id, uploadResult.url, job);

    createNotification(
      job.employer,
      'application_received',
      'New Application Received',
      `${req.user.name} applied for ${job.title}`,
      { jobId: job._id, applicationId: application._id }
    );

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error('applyToJob Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCandidateApplications = async (req, res) => {
  try {
    const candidateId = req.user._id;

    const applications = await Application.find({ candidate: candidateId })
      .populate({
        path: 'job',
        select: 'title location type salary status employer',
        populate: {
          path: 'employer',
          select: 'companyName companyLogo',
        },
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error('getCandidateApplications Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.employer.toString() !== employerId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'name email resumeUrl')
      .sort({ aiScore: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error('getJobApplications Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, interviewDate } = req.body;
    const employerId = req.user._id;

    const validStatuses = ['applied', 'shortlisted', 'interview', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (status === 'interview' && !interviewDate) {
      return res.status(400).json({ success: false, message: 'Interview date is required for interview status' });
    }

    const application = await Application.findById(id).populate('job').populate('candidate', 'name email');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.job.employer.toString() !== employerId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this application' });
    }

    application.status = status;
    const now = new Date();
    if (status === 'shortlisted') application.shortlistedAt = now;
    else if (status === 'interview') {
      application.interviewAt = now;
      application.interviewDate = new Date(interviewDate);
    }
    else if (status === 'rejected') application.rejectedAt = now;
    else if (status === 'hired') application.hiredAt = now;

    await application.save();

    // Fire-and-forget email
    sendStatusEmail(application.candidate.email, application.candidate.name, application.job.title, status);

    // Socket.io emit
    const io = req.app.get('io');
    if (io) {
      io.emit('applicationStatusUpdated', {
        candidateId: application.candidate._id,
        jobTitle: application.job.title,
        status: status,
      });
    }

    createNotification(
      application.candidate._id,
      'status_changed',
      'Application Status Updated',
      `Your application for ${application.job.title} has been ${status}`,
      { jobId: application.job._id, applicationId: application._id }
    );

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error('updateApplicationStatus Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const candidateId = req.user._id;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.candidate.toString() !== candidateId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to withdraw this application' });
    }

    if (application.status !== 'applied') {
      return res.status(400).json({ success: false, message: 'Cannot withdraw application after it has been processed' });
    }

    await Application.findByIdAndDelete(id);

    await Job.findByIdAndUpdate(application.job, { $inc: { applicantCount: -1 } });

    res.status(200).json({ success: true, message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('withdrawApplication Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
