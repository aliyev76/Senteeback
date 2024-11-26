import jwt from 'jsonwebtoken';

const requireRole = (role) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== role) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export default requireRole;

