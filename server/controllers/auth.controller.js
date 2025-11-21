const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

// Générer les tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// Inscription
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'COLLABORATOR' } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role
      }
    });

    // Générer les tokens
    const { accessToken, refreshToken } = generateTokens(newUser.id);

    // Sauvegarder le refresh token dans la base de données
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
      }
    });

    // Envoyer les tokens dans des cookies HTTP-only
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    });

    // Retourner les données utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      user: userWithoutPassword,
      message: "Inscription réussie"
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: error.message });
  }
};

// Connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      include: { enterprise: true }
    });

    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Générer les tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Supprimer les anciens refresh tokens
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id }
    });

    // Sauvegarder le nouveau refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // Envoyer les tokens dans des cookies HTTP-only
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Retourner les données utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      user: userWithoutPassword,
      message: "Connexion réussie"
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: error.message });
  }
};

// Rafraîchir le token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.cookies;

    if (!token) {
      return res.status(401).json({ error: "Refresh token manquant" });
    }

    // Vérifier le refresh token
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

    // Vérifier que le token existe dans la base de données
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token }
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ error: "Refresh token invalide ou expiré" });
    }

    // Générer un nouveau access token
    const accessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '15m' });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.status(200).json({ message: "Token rafraîchi" });
  } catch (error) {
    console.error('Erreur lors du rafraîchissement:', error);
    res.status(401).json({ error: "Refresh token invalide" });
  }
};

// Déconnexion
const logout = async (req, res) => {
  try {
    const { refreshToken: token } = req.cookies;

    if (token) {
      // Supprimer le refresh token de la base de données
      await prisma.refreshToken.deleteMany({
        where: { token }
      });
    }

    // Supprimer les cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir l'utilisateur actuel
const getCurrentUser = async (req, res) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    const decoded = jwt.verify(accessToken, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { enterprise: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        enterpriseId: true,
        enterprise: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json({ user });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expiré" });
    }
    res.status(401).json({ error: "Token invalide" });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser
};

