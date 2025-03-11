const { createDefaultAdmin } = require("./adminSeeder");
const { createDemoTeams } = require("./teamSeeder");
const { createDemoTournaments } = require("./tournamentSeeder");
const { createDemoTournamentTeams } = require("./tournamentTeamSeeder");
const { createDemoMatches } = require("./matchSeeder");

const createDemoData = async () => {
  console.log("🌱 Début de la création des données de démonstration...");

  // Exécuter les seeders dans un ordre logique
  await createDefaultAdmin();
  const teamsCreated = await createDemoTeams();
  const tournamentsCreated = await createDemoTournaments();

  if (teamsCreated && tournamentsCreated) {
    await createDemoTournamentTeams();
    await createDemoMatches();
  }

  console.log("✅ Création des données de démonstration terminée");
};

module.exports = { createDemoData };
