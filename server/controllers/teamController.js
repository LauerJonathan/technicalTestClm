const { Team, Tournament, TournamentTeam } = require("../models");

// Créer une nouvelle équipe
const createTeam = async (req, res) => {
  try {
    const { name, player1Name, player2Name } = req.body;

    const team = await Team.create({
      name,
      player1Name,
      player2Name,
    });

    res.status(201).json({
      success: true,
      team,
    });
  } catch (error) {
    console.error("Erreur création d'équipe:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'équipe",
      error: error.message,
    });
  }
};

// Récupérer toutes les équipes
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      order: [["name", "ASC"]],
    });

    res.status(200).json({
      success: true,
      teams,
    });
  } catch (error) {
    console.error("Erreur récupération des équipes:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des équipes",
      error: error.message,
    });
  }
};

// Ajouter une équipe à un tournoi
const addTeamToTournament = async (req, res) => {
  try {
    const { tournamentId, teamId } = req.body;

    // Vérifier si le tournoi existe
    const tournament = await Tournament.findByPk(tournamentId);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournoi non trouvé",
      });
    }

    // Vérifier si l'équipe existe
    const team = await Team.findByPk(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Équipe non trouvée",
      });
    }

    // Vérifier si l'équipe est déjà inscrite au tournoi
    const existingRegistration = await TournamentTeam.findOne({
      where: {
        tournamentId,
        teamId,
      },
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "Cette équipe est déjà inscrite à ce tournoi",
      });
    }

    // Ajouter l'équipe au tournoi
    await TournamentTeam.create({
      tournamentId,
      teamId,
    });

    res.status(201).json({
      success: true,
      message: "Équipe ajoutée au tournoi avec succès",
    });
  } catch (error) {
    console.error("Erreur ajout d'équipe au tournoi:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout de l'équipe au tournoi",
      error: error.message,
    });
  }
};

// Retirer une équipe d'un tournoi
const removeTeamFromTournament = async (req, res) => {
  try {
    const { tournamentId, teamId } = req.params;

    // Vérifier si l'inscription existe
    const registration = await TournamentTeam.findOne({
      where: {
        tournamentId,
        teamId,
      },
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Cette équipe n'est pas inscrite à ce tournoi",
      });
    }

    // Supprimer l'inscription
    await registration.destroy();

    res.status(200).json({
      success: true,
      message: "Équipe retirée du tournoi avec succès",
    });
  } catch (error) {
    console.error("Erreur retrait d'équipe du tournoi:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du retrait de l'équipe du tournoi",
      error: error.message,
    });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  addTeamToTournament,
  removeTeamFromTournament,
};
