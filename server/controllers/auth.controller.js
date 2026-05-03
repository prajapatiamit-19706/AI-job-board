import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOTPEmail } from '../utils/sendOtpEmail.js';


const generateOTP = () => {
  // Use 900000 to ensure it always generates exactly a 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body

    // validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password and role are required'
      })
    }

    // check existing user
    const existingUser = await User.findOne({ email })
    // correct — allow re-registration if not verified yet
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    // if user exists but not verified — delete old record and let them register fresh
    if (existingUser && !existingUser.isVerified) {
      await User.deleteOne({ email })
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // generate OTP
    const otp = generateOTP()

    // build user object
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'candidate',
      isVerified: false,
      otp,
      otpExpiresAt: Date.now() + 10 * 60 * 1000  // 10 mins
    })

    // only set companyName for employers
    if (role === 'employer' && companyName) {
      user.companyName = companyName
    }

    await user.save()

    console.log('OTP generated:', otp)

    // send OTP email — fire and forget
    sendOTPEmail(email, name, otp).catch(err =>
      console.error('OTP email error:', err.message)
    )

    return res.status(201).json({
      success: true,
      data: {
        userId: user._id,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Register error:', error.message)
    return res.status(500).json({ success: false, message: error.message })
  }
}


// verify Register otp
// export const verifyRegisterOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ success: false, message: "User not found" });
//     }
//     if (user.otp !== otp) {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }
//     if (user.otpExpiry < Date.now()) {
//       return res.status(400).json({ success: false, message: "OTP has expired" });
//     }

//     user.isVerified = true;
//     user.otp = undefined;
//     user.otpExpiry = undefined;

//     await user.save();


//     res.status(200).json({
//       message: "Registration successfull",
//       success: true,
//       data: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         token: generateToken(user._id),
//       }
//     })

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// }


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "User not found or not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified. Please login.'
      })
    }

    // compare as strings — both sides
    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      })
    }

    if (new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired. Please register again to get a new code.'
      })
    }

    // verify user + clear OTP — use user._id not userId
    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      otp: null,
      otpExpiresAt: null
    })

    // generate JWT — log them in immediately
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    })

  } catch (error) {
    console.error('verifyOTP error:', error.message)
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Already verified' })
    }

    const otp = generateOTP()
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await User.findByIdAndUpdate(user._id, { otp, otpExpiresAt })

    sendOTPEmail(user.email, user.name, otp).catch(err =>
      console.error('Resend OTP email failed:', err.message)
    )

    return res.json({ success: true, message: 'New OTP sent to your email' })

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}





// verify Login otp
// export const verifyLoginOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ success: false, message: "User not found" });
//     }
//     if (user.otp !== otp) {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }
//     if (user.otpExpiry < Date.now()) {
//       return res.status(400).json({ success: false, message: "OTP has expired" });
//     }

//     user.isVerified = true;
//     user.otp = undefined;
//     user.otpExpiry = undefined;

//     await user.save();


//     res.status(200).json({
//       message: "Login successfull",
//       success: true,
//       data: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         token: generateToken(user._id),
//       }
//     })

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// }

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: 'Account is not verified yet. Please register or verify OTP.' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await user.save();

    sendOTPEmail(email, user.name, otp).catch(err =>
      console.error('Forgot Password OTP email failed:', err.message)
    );

    return res.json({ success: true, message: 'Password reset OTP sent to your email' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // compare as strings — both sides
    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    if (new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
