const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Aucun token fourni, accès refusé",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findByPk(decoded.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Administrateur non trouvé",
      });
    }

    // Stock uniquement les informations essentielles
    req.admin = {
      id: decoded.id,
      username: decoded.username,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token invalide",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expiré",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de l'authentification",
      error:
        process.env.NODE_ENV === "production"
          ? "Erreur interne"
          : error.message,
    });
  }
};

module.exports = { authenticateAdmin };
