const jwtUtils = require('../utils/jwtUtils');

// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Decode token
    const decoded = jwtUtils.decodeToken(token);

    // Attach decoded token to request object for future use
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { verifyToken };
