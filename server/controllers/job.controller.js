import Job from '../models/Job.model.js';

export const createJob = async (req, res) => {
  try {
    const { title, description, requirements, skills, location, type, salary, status } = req.body;

    const job = await Job.create({
      employer: req.user._id,
      title,
      description,
      requirements,
      skills,
      location,
      type,
      salary,
      status: status || 'open',
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { search, type, location, page = 1, limit = 10 } = req.query;

    const query = { status: 'open' };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .populate('employer', 'name companyName companyLogo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      data: {
        jobs,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name companyName companyLogo');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updatedJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const closeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to close this job' });
    }

    job.status = 'closed';
    await job.save();

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await Job.deleteOne({ _id: req.params.id });

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });

    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
