const express = require("express");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const Admin = require("../models/Admin");
const { authenticateAdmin } = require("../middleware/auth");

const router = express.Router();

// Inscription d'un nouvel administrateur
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'admin existe déjà
    const existingAdmin = await Admin.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message:
          "Un utilisateur avec cet email ou ce nom d'utilisateur existe déjà",
      });
    }

    // Créer le nouvel admin
    const admin = await Admin.create({
      username,
      email,
      password,
    });

    // Générer un token JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
      token,
    });
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
      error: error.message,
    });
  }
});

// Connexion d'un administrateur
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'admin existe
    const admin = await Admin.findOne({ where: { email } });

    // Message d'erreur générique
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Identifiants incorrects",
      });
    }

    // AccountLocked ?
    if (admin.accountLocked) {
      return res.status(403).json({
        success: false,
        message:
          "Compte temporairement bloqué suite à plusieurs tentatives échouées",
      });
    }
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {

      if (admin.failedLoginAttempts !== undefined) {
        admin.failedLoginAttempts += 1;

        // Verrouiller le compte après 5 tentatives échouées
        if (admin.failedLoginAttempts >= 5) {
          admin.accountLocked = true;
        }

        await admin.save();
      }

      return res.status(401).json({
        success: false,
        message: "Identifiants incorrects",
      });
    }

    // Réinitialiser le compteur d'échecs si authentification réussie
    if (admin.failedLoginAttempts !== undefined) {
      admin.failedLoginAttempts = 0;
      admin.accountLocked = false;
    }

    // Enregistrer la date de dernière connexion
    admin.lastLogin = new Date();
    await admin.save();

    // Générer un token JWT avec une durée configurable
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    const { password: pwd, ...adminWithoutPassword } = admin.toJSON();

    res.status(200).json({
      success: true,
      admin: adminWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      // Ne pas exposer les détails d'erreur en production
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
});

// Route protégée - Obtenir le profil de l'admin connecté
router.get("/profile", authenticateAdmin, async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: { exclude: ["password"] },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Administrateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Erreur de récupération du profil:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil",
      error: error.message,
    });
  }
});

module.exports = router;
