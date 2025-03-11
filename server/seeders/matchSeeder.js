const Match = require("../models/Match");
const Tournament = require("../models/Tournament");
const TournamentTeam = require("../models/TournamentTeam");

const createDemoMatches = async () => {
  try {
    // Vérifier si des matches existent déjà
    const matchCount = await Match.count();

    if (matchCount === 0) {
      // Récupérer tous les tournois non brouillons
      const tournaments = await Tournament.findAll({
        where: {
          status: ["open", "in_progress", "completed"],
        },
      });

      if (tournaments.length === 0) {
        console.error("❌ Aucun tournoi trouvé pour créer les matches");
        return false;
      }

      const matches = [];

      // Pour chaque tournoi, créer des matches
      for (const tournament of tournaments) {
        // Récupérer les équipes inscrites à ce tournoi
        const tournamentTeams = await TournamentTeam.findAll({
          where: {
            tournamentId: tournament.id,
          },
          include: [
            {
              model: require("../models/Team"),
            },
          ],
        });

        if (tournamentTeams.length < 2) continue;

        // Générer des matches entre les équipes
        for (let i = 0; i < tournamentTeams.length; i++) {
          for (let j = i + 1; j < tournamentTeams.length; j++) {
            const homeTeam = tournamentTeams[i];
            const awayTeam = tournamentTeams[j];

            // Créer une date de match
            const tournamentDate = new Date(tournament.date);
            const matchDate = new Date(tournamentDate);
            matchDate.setDate(
              tournamentDate.getDate() - 10 + Math.floor(Math.random() * 20)
            );

            let status, homeScore, awayScore, playedDate;

            // Définir le statut et le score selon le statut du tournoi
            if (tournament.status === "completed") {
              status = "completed";
              homeScore = Math.floor(Math.random() * 5);
              awayScore = Math.floor(Math.random() * 5);
              playedDate = new Date(matchDate);
            } else if (
              tournament.status === "in_progress" &&
              Math.random() > 0.5
            ) {
              status = "completed";
              homeScore = Math.floor(Math.random() * 5);
              awayScore = Math.floor(Math.random() * 5);
              playedDate = new Date(matchDate);
            } else {
              status = "scheduled";
              homeScore = null;
              awayScore = null;
              playedDate = null;
            }

            matches.push({
              tournamentId: tournament.id,
              homeTeamId: homeTeam.teamId,
              awayTeamId: awayTeam.teamId,
              homeScore: homeScore,
              awayScore: awayScore,
              status: status,
              scheduledDate: matchDate,
              playedDate: playedDate,
            });
          }
        }
      }

      await Match.bulkCreate(matches);
      console.log("✅ Matches de démonstration créés avec succès");
      return true;
    } else {
      console.log(
        "ℹ️ Des matches existent déjà, aucun match de démonstration créé"
      );
      return false;
    }
  } catch (error) {
    console.error(
      "❌ Erreur lors de la création des matches de démonstration:",
      error
    );
    return false;
  }
};

module.exports = { createDemoMatches };
