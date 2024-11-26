import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../models/User.js';
import {
  sendRegistrationEmail,
  sendPasswordResetEmail,
  sendContactEmail,
} from '../services/email/emailService.js';

// Contact Us Handler
export const contactUs = async (req, res, next) => {
  const { name, email, message } = req.body;
  try {
    if (!name || !email || !message) throw new Error('All fields are required.');
    await sendContactEmail(name, email, message);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    next(error);
  }
};

// Forgot Password Handler
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({
        emailExists: false,
        message: 'If the email exists, a reset link has been sent.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset_password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetLink);
    res.status(200).json({
      emailExists: true,
      message: 'If the email exists, a reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password Handler
export const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      where: { resetToken: hashedToken, resetTokenExpiry: { [Op.gt]: Date.now() } },
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired token.' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    next(error);
  }
};

// Register User Handler
export const registerUser = async (req, res, next) => {
  const { username, email, password, phone, address, role } = req.body;
  try {
    // Check for duplicate email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = role && ['user', 'admin'].includes(role) ? role : 'user';
    const user = await User.create({ username, email, password: hashedPassword, phone, address, role: assignedRole });

    await sendRegistrationEmail(email, username,password);
    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (error) {
    next(error);
  }
};

// Login User Handler
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful.', token, user });
  } catch (error) {
    next(error);
  }
};

