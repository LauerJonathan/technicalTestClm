const { Tournament, Team, TournamentTeam, Match } = require("../models");
const { Op } = require("sequelize");

// Créer un nouveau tournoi
const createTournament = async (req, res) => {
  try {
    const { name, date, description } = req.body;

    const tournament = await Tournament.create({
      name,
      date,
      description,
      createdById: req.admin.id,
    });

    res.status(201).json({
      success: true,
      tournament,
    });
  } catch (error) {
    console.error("Erreur création de tournoi:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du tournoi",
      error: error.message,
    });
  }
};

// Récupérer tous les tournois
const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.findAll({
      order: [["date", "DESC"]],
    });

    res.status(200).json({
      success: true,
      tournaments,
    });
  } catch (error) {
    console.error("Erreur récupération des tournois:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des tournois",
      error: error.message,
    });
  }
};

// Récupérer un tournoi par son ID
const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findByPk(id, {
      include: [
        {
          model: Team,
          through: {
            attributes: [
              "points",
              "matchesPlayed",
              "matchesWon",
              "matchesLost",
              "matchesDraw",
              "goalsFor",
              "goalsAgainst",
            ],
          },
        },
      ],
    });

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournoi non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      tournament,
    });
  } catch (error) {
    console.error("Erreur récupération du tournoi:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du tournoi",
      error: error.message,
    });
  }
};

// Mettre à jour un tournoi
const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, description, status } = req.body;

    const tournament = await Tournament.findByPk(id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournoi non trouvé",
      });
    }

    await tournament.update({
      name,
      date,
      description,
      status,
    });

    res.status(200).json({
      success: true,
      tournament,
    });
  } catch (error) {
    console.error("Erreur mise à jour du tournoi:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du tournoi",
      error: error.message,
    });
  }
};

// Supprimer un tournoi
const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findByPk(id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournoi non trouvé",
      });
    }

    await tournament.destroy();

    res.status(200).json({
      success: true,
      message: "Tournoi supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression du tournoi:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du tournoi",
      error: error.message,
    });
  }
};

// Générer les matchs automatiquement pour un tournoi
const generateMatches = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await Tournament.findByPk(id, {
      include: [{ model: Team }],
    });

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournoi non trouvé",
      });
    }

    if (tournament.Teams.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Il faut au moins 2 équipes pour générer les matchs",
      });
    }

    // Vérifier si des matchs existent déjà
    const existingMatchesCount = await Match.count({
      where: { tournamentId: id },
    });

    if (existingMatchesCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Des matchs ont déjà été générés pour ce tournoi",
      });
    }

    const teams = tournament.Teams;
    const matches = [];

    // Date de début (à partir de la date du tournoi ou de demain si la date du tournoi est passée)
    const tournamentDate = new Date(tournament.date);
    const now = new Date();
    let matchDate = new Date(tournamentDate);

    // Si la date du tournoi est dans le passé, commencer à partir de demain
    if (matchDate < now) {
      matchDate = new Date();
      matchDate.setDate(matchDate.getDate() + 1); // Commencer demain
    }

    // Réinitialiser l'heure à 9h du matin
    matchDate.setHours(9, 0, 0, 0);

    // Heures possibles pour les matchs (9h, 11h, 14h, 16h, 18h)
    const matchHours = [9, 11, 14, 16, 18];
    let hourIndex = 0;

    // Générer tous les matchs (chaque équipe rencontre toutes les autres une fois)
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        // Créer la date planifiée pour ce match
        const scheduledDate = new Date(matchDate);
        scheduledDate.setHours(matchHours[hourIndex], 0, 0, 0);

        matches.push({
          tournamentId: tournament.id,
          homeTeamId: teams[i].id,
          awayTeamId: teams[j].id,
          status: "scheduled",
          scheduledDate: scheduledDate,
        });

        // Passer à l'heure suivante
        hourIndex = (hourIndex + 1) % matchHours.length;

        // Si on a utilisé toutes les heures de la journée, passer au jour suivant
        if (hourIndex === 0) {
          matchDate.setDate(matchDate.getDate() + 1);
        }
      }
    }

    // Créer tous les matchs dans la base de données
    await Match.bulkCreate(matches);

    // Mettre à jour le statut du tournoi
    await tournament.update({ status: "in_progress" });

    res.status(201).json({
      success: true,
      message: `${matches.length} matchs générés avec succès`,
      matchesCount: matches.length,
    });
  } catch (error) {
    console.error("Erreur génération des matchs:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la génération des matchs",
      error: error.message,
    });
  }
};

module.exports = {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  generateMatches,
};
