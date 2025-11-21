const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware pour vérifier l'authentification
const authenticate = (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    const decoded = jwt.verify(accessToken, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expiré" });
    }
    return res.status(401).json({ error: "Token invalide" });
  }
};

module.exports = { authenticate };

