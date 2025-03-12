const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const createDefaultAdmin = async () => {
  try {
    // Vérifier si un admin existe déjà
    const adminCount = await Admin.count();
    
    if (adminCount === 0) {
      let adminPassword = "Admin123!"; // Mot de passe par défaut pour le développement
      
      // En production, générer un mot de passe aléatoire => A MODIFIER PAR L'UTILISATEUR A LA 1 CO
      if (process.env.NODE_ENV === "production") {
        adminPassword = crypto.randomBytes(12).toString('hex') + "A1!";
      }
      
      // Créer l'admin par défaut
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      await Admin.create({
        username: "admin",
        email: "admin@babyfoot.com",
        password: hashedPassword,
      }, {
        // Éviter de déclencher à nouveau le hook beforeCreate qui hasherait un mot de passe déjà hashé
        hooks: false
      });
      
      // N'afficher le mot de passe que dans les environnements de développement
      if (process.env.NODE_ENV !== "production") {
        console.log("🔑 : Test identifiers");
        console.log("Email: admin@babyfoot.com");
        console.log("Mot de passe: " + adminPassword);
      } else {
        console.log("✅ Administrateur par défaut créé avec un mot de passe sécurisé");
        console.log("Pour des raisons de sécurité, veuillez utiliser la fonctionnalité de réinitialisation de mot de passe");
      }
    } else {
      console.log("ℹ️ Des administrateurs existent déjà, aucun administrateur par défaut créé");
    }
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'administrateur par défaut:", error);
  }
};

module.exports = { createDefaultAdmin };