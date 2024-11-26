import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.error('No authorization header provided.');
    return res.status(401).json({ error: 'Unauthorized: Missing authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('Token missing from authorization header.');
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.error('User not found for token.');
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = user; // Attach user to the request
    next(); // Continue to the next middleware
  } catch (error) {
    console.error('Authentication error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized: Token expired' });
    }

    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};

