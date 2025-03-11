const Tournament = require("../models/Tournament");
const Admin = require("../models/Admin");

const createDemoTournaments = async () => {
  try {
    // Vérifier si des tournois existent déjà
    const tournamentCount = await Tournament.count();

    if (tournamentCount === 0) {
      // Obtenir l'ID de l'admin par défaut
      const admin = await Admin.findOne({ where: { username: "admin" } });

      if (!admin) {
        console.error("❌ Admin par défaut non trouvé pour créer les tournois");
        return false;
      }

      // Dates pour les tournois (passés, en cours, futurs)
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 15);
      const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 10);

      // Créer les tournois de démo
      const demoTournaments = [
        {
          name: "Tournoi d'Hiver",
          date: twoMonthsAgo,
          description:
            "Le grand tournoi d'hiver annuel. Compétition amicale ouverte à tous les niveaux.",
          status: "completed",
          createdById: admin.id,
        },
        {
          name: "Challenge du Printemps",
          date: lastMonth,
          description:
            "Affrontez les meilleures équipes dans ce tournoi saisonnier.",
          status: "completed",
          createdById: admin.id,
        },
        {
          name: "Tournoi Actuel",
          date: now,
          description:
            "Le tournoi officiel en cours. Inscrivez-vous maintenant pour participer !",
          status: "in_progress",
          createdById: admin.id,
        },
        {
          name: "Coupe d'Été",
          date: nextMonth,
          description:
            "Préparez-vous pour le grand événement de l'été. Inscriptions ouvertes.",
          status: "open",
          createdById: admin.id,
        },
        {
          name: "Tournoi Amateur",
          date: new Date(now.getFullYear(), now.getMonth() + 2, 5),
          description:
            "Tournoi réservé aux joueurs débutants et intermédiaires.",
          status: "draft",
          createdById: admin.id,
        },
      ];

      await Tournament.bulkCreate(demoTournaments);
      console.log("✅ Tournois de démonstration créés avec succès");
      return true;
    } else {
      console.log(
        "ℹ️ Des tournois existent déjà, aucun tournoi de démonstration créé"
      );
      return false;
    }
  } catch (error) {
    console.error(
      "❌ Erreur lors de la création des tournois de démonstration:",
      error
    );
    return false;
  }
};

module.exports = { createDemoTournaments };
