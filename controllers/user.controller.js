const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role, provider } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, passwordHash, provider, role });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login for classic connexion
exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email, provider: "email" });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkUserExist = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      provider: req.body.provider,
    });
    res
      .status(200)
      .json({ message: "User email not found with given provider", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Trouver l'utilisateur correspondant
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Hacher le nouveau mot de passe
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    user.passwordHash = passwordHash;
    await user.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    res.status(500).json({ message: "Erreur lors de la réinitialisation du mot de passe." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé avec cet email.' });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const emailPayload = {
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Bonjour ${user.username},\n\nCliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`,
      html: `
        <h1>Réinitialisation de votre mot de passe</h1>
        <p>Bonjour ${user.username},</p>
        <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Ce lien est valable pendant 1 heure.</p>
      `,
    };

    await axios.post(`${process.env.NOTIFICATION_SERVER_URL}/send-email`, emailPayload);

    res.status(200).json({ message: 'Email de réinitialisation envoyé.' });
  } catch (error) {
    console.error("Erreur dans forgotPassword:", error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email de réinitialisation.' });
  }
};