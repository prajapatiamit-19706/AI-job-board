import User from '../models/User.model.js';
import Job from '../models/Job.model.js';
import Application from '../models/Application.model.js';

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const openJobs = await Job.countDocuments({ status: 'open' });
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const totalEmployers = await User.countDocuments({ role: 'employer' });

    const avgScoreResult = await Application.aggregate([
      { $match: { aiScore: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgScore: { $avg: '$aiScore' } } }
    ]);
    const avgAIScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : null;

    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalJobs,
        totalApplications,
        openJobs,
        totalCandidates,
        totalEmployers,
        avgAIScore,
        applicationsByStatus
      }
    });
  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getApplicationsPerDay = async (req, res) => {
  try {
    const date14DaysAgo = new Date();
    date14DaysAgo.setDate(date14DaysAgo.getDate() - 14);

    const data = await Application.aggregate([
      { $match: { appliedAt: { $gte: date14DaysAgo } } },
      {
        $group: {
          _id: {
             year: { $year: '$appliedAt' },
             month: { $month: '$appliedAt' },
             day: { $dayOfMonth: '$appliedAt' },
             dateString: { $dateToString: { format: '%b %d', date: '$appliedAt' } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      { $project: { _id: 0, date: '$_id.dateString', count: 1 } }
    ]);

    res.json({ success: true, data });
  } catch (error) {
    console.error('getApplicationsPerDay error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('employer', 'name companyName')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error('getAllJobs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot toggle admin status' });
    }
    
    user.isVerified = !user.isVerified;
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('toggleUserStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
