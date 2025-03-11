const Team = require("../models/Team");

const demoTeams = [
  {
    name: "Les Invincibles",
    player1Name: "Jean Dupont",
    player2Name: "Marie Martin",
  },
  {
    name: "Rocket Power",
    player1Name: "Thomas Bernard",
    player2Name: "Sophie Petit",
  },
  {
    name: "Goal Diggers",
    player1Name: "Pierre Lambert",
    player2Name: "Julie Dubois",
  },
  {
    name: "Les Tactiques",
    player1Name: "Nicolas Moreau",
    player2Name: "Émilie Rousseau",
  },
  {
    name: "Foot Fury",
    player1Name: "Alexandre Leroy",
    player2Name: "Camille Blanc",
  },
  {
    name: "Les Maestros",
    player1Name: "David Richard",
    player2Name: "Laura Michel",
  },
  {
    name: "Ball Breakers",
    player1Name: "Julien Robert",
    player2Name: "Céline Durand",
  },
  {
    name: "Thunder Strike",
    player1Name: "Maxime Simon",
    player2Name: "Aurélie Laurent",
  },
];

const createDemoTeams = async () => {
  try {
    // Vérifier si des équipes existent déjà
    const teamCount = await Team.count();

    if (teamCount === 0) {
      // Créer les équipes de démo
      await Team.bulkCreate(demoTeams);
      console.log("✅ Équipes de démonstration créées avec succès");
      return true;
    } else {
      console.log(
        "ℹ️ Des équipes existent déjà, aucune équipe de démonstration créée"
      );
      return false;
    }
  } catch (error) {
    console.error(
      "❌ Erreur lors de la création des équipes de démonstration:",
      error
    );
    return false;
  }
};

module.exports = { createDemoTeams };
