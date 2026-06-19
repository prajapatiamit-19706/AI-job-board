import User from '../models/User.model.js';
import cloudinary from '../config/cloudinary.js';

// ── GET /api/profile/me ───────────────────────────────────────────
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -otp -otpExpiresAt');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ── GET /api/profile/:userId (public — employer views candidate) ──
export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select(
            'name headline bio location avatar skills education experience projects portfolioUrl githubUrl linkedinUrl isOpenToWork profileCompletionScore resumeUrl'
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ── PUT /api/profile/me ───────────────────────────────────────────
export const updateProfile = async (req, res) => {
    try {
        const {
            name, headline, bio, phone, location, dateOfBirth, gender,
            portfolioUrl, githubUrl, linkedinUrl,
            skills, education, experience, projects,
            expectedSalary, jobType, availableFrom, isOpenToWork,
        } = req.body;

        const updateData = {
            name, headline, bio, phone, location, dateOfBirth, gender,
            portfolioUrl, githubUrl, linkedinUrl,
            skills, education, experience, projects,
            expectedSalary, jobType, availableFrom, isOpenToWork,
        };

        // Clean up empty strings for optional typed fields to avoid validation/cast errors
        if (updateData.gender === "") updateData.gender = undefined;
        if (updateData.jobType === "") updateData.jobType = undefined;
        if (updateData.dateOfBirth === "") updateData.dateOfBirth = undefined;
        if (updateData.availableFrom === "") updateData.availableFrom = undefined;

        // Sanitize nested education arrays
        if (Array.isArray(updateData.education)) {
            updateData.education = updateData.education.map(edu => ({
                degree: edu.degree || undefined,
                field: edu.field || undefined,
                institution: edu.institution || undefined,
                startYear: edu.startYear ? Number(edu.startYear) : undefined,
                endYear: edu.endYear ? Number(edu.endYear) : undefined,
                grade: edu.grade || undefined,
            }));
        }

        // Sanitize nested experience arrays
        if (Array.isArray(updateData.experience)) {
            updateData.experience = updateData.experience.map(exp => ({
                title: exp.title || undefined,
                company: exp.company || undefined,
                location: exp.location || undefined,
                startDate: exp.startDate || undefined,
                endDate: exp.endDate || undefined,
                isCurrent: !!exp.isCurrent,
                description: exp.description || undefined,
            }));
        }

        // Sanitize nested projects arrays
        if (Array.isArray(updateData.projects)) {
            updateData.projects = updateData.projects.map(proj => ({
                title: proj.title || undefined,
                description: proj.description || undefined,
                techStack: Array.isArray(proj.techStack) ? proj.techStack : [],
                liveUrl: proj.liveUrl || undefined,
                githubUrl: proj.githubUrl || undefined,
            }));
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update fields individually
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                user[key] = updateData[key];
            }
        });

        await user.save();

        // Remove sensitive fields
        user.password = undefined;
        user.otp = undefined;
        user.otpExpiresAt = undefined;

        res.json({ message: 'Profile updated', user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ── POST /api/profile/avatar ──────────────────────────────────────
// Expects multipart/form-data with field "avatar"
export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        // upload buffer to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'ai-job-board/avatars', transformation: [{ width: 400, height: 400, crop: 'fill' }] },
                (error, result) => (error ? reject(error) : resolve(result))
            );
            stream.end(req.file.buffer);
        });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.avatar = result.secure_url;
        await user.save();

        // Remove sensitive fields
        user.password = undefined;
        user.otp = undefined;
        user.otpExpiresAt = undefined;

        res.json({ message: 'Avatar uploaded', avatarUrl: result.secure_url, user });
    } catch (err) {
        res.status(500).json({ message: 'Upload failed', error: err.message });
    }
};