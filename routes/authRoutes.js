import express from 'express';
import rateLimiter from '../middlewares/rateLimiter.js';
import {
  registerUser,
  loginUser,
  contactUs,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { check } from 'express-validator';

const router = express.Router();

router.post('/contact', contactUs);

router.post('/forgot-password', forgotPassword);

router.post(
  '/reset-password',
  [
    check('token').notEmpty().withMessage('Token is required'),
    check('newPassword')
      .isLength({ min: 8 })
      .matches(/[A-Z]/)
      .matches(/[a-z]/)
      .matches(/\d/),
  ],
  resetPassword
);

router.post(
  '/register',
  rateLimiter,
  [
    check('username').notEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 8 }),
    check('phone').notEmpty(),
    check('address').notEmpty(),
  ],
  registerUser
);

router.post(
  '/login',
  rateLimiter,
  [
    check('email').isEmail(),
    check('password').notEmpty(),
  ],
  loginUser
);

export default router;

