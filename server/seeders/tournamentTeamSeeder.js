const Tournament = require("../models/Tournament");
const Team = require("../models/Team");
const TournamentTeam = require("../models/TournamentTeam");

const createDemoTournamentTeams = async () => {
  try {
    // Vérifier si des inscriptions tournoi-équipe existent déjà
    const tournamentTeamCount = await TournamentTeam.count();

    if (tournamentTeamCount === 0) {
      // Récupérer tous les tournois et équipes
      const tournaments = await Tournament.findAll();
      const teams = await Team.findAll();

      if (tournaments.length === 0 || teams.length === 0) {
        console.error(
          "❌ Aucun tournoi ou équipe trouvé pour créer les inscriptions"
        );
        return false;
      }

      const tournamentTeams = [];

      // Pour chaque tournoi, inscrire plusieurs équipes avec des statistiques
      tournaments.forEach((tournament) => {
        // Nombre d'équipes à inscrire pour ce tournoi (entre 4 et 8)
        const numTeams =
          tournament.status === "draft"
            ? 0
            : tournament.status === "open"
            ? 6
            : 8;

        // Mélanger les équipes et en prendre un certain nombre
        const shuffledTeams = [...teams]
          .sort(() => 0.5 - Math.random())
          .slice(0, numTeams);

        shuffledTeams.forEach((team) => {
          // Pour les tournois terminés ou en cours, créer des statistiques
          if (
            tournament.status === "completed" ||
            tournament.status === "in_progress"
          ) {
            const matchesPlayed =
              tournament.status === "completed"
                ? Math.floor(Math.random() * 5) + 5 // 5-10 matches pour les tournois terminés
                : Math.floor(Math.random() * 3) + 2; // 2-5 matches pour les tournois en cours

            const matchesWon = Math.floor(Math.random() * matchesPlayed);
            const matchesDraw = Math.floor(
              Math.random() * (matchesPlayed - matchesWon)
            );
            const matchesLost = matchesPlayed - matchesWon - matchesDraw;

            const goalsFor =
              matchesWon * 2 + matchesDraw + Math.floor(Math.random() * 10);
            const goalsAgainst =
              matchesLost * 2 + matchesDraw + Math.floor(Math.random() * 8);

            const points = matchesWon * 3 + matchesDraw;

            tournamentTeams.push({
              tournamentId: tournament.id,
              teamId: team.id,
              points: points,
              matchesPlayed: matchesPlayed,
              matchesWon: matchesWon,
              matchesDraw: matchesDraw,
              matchesLost: matchesLost,
              goalsFor: goalsFor,
              goalsAgainst: goalsAgainst,
            });
          } else {
            // Pour les tournois en préparation, juste inscrire les équipes sans stats
            tournamentTeams.push({
              tournamentId: tournament.id,
              teamId: team.id,
              points: 0,
              matchesPlayed: 0,
              matchesWon: 0,
              matchesDraw: 0,
              matchesLost: 0,
              goalsFor: 0,
              goalsAgainst: 0,
            });
          }
        });
      });

      await TournamentTeam.bulkCreate(tournamentTeams);
      console.log(
        "✅ Inscriptions tournoi-équipe de démonstration créées avec succès"
      );
      return true;
    } else {
      console.log(
        "ℹ️ Des inscriptions tournoi-équipe existent déjà, aucune inscription de démonstration créée"
      );
      return false;
    }
  } catch (error) {
    console.error(
      "❌ Erreur lors de la création des inscriptions tournoi-équipe de démonstration:",
      error
    );
    return false;
  }
};

module.exports = { createDemoTournamentTeams };
