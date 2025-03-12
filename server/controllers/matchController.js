const { Match, Team, Tournament, TournamentTeam } = require("../models");
const { sequelize } = require("../config/database");
const { Op } = require("sequelize");

const getUpcomingFiveMatches = async (req, res) => {
  try {
    const today = new Date();

    const upcomingMatches = await Match.findAll({
      where: {
        scheduledDate: {
          [Op.gte]: today, // Uniquement les matchs à venir
        },
        status: "scheduled",
      },
      order: [["scheduledDate", "ASC"]], // Tri par date croissante
      limit: 6, // Limiter à 6 résultats
    });

    res.status(200).json({
      success: true,
      count: upcomingMatches.length,
      data: upcomingMatches,
    });
  } catch (error) {
    console.error("Erreur récupération des prochains matchs:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des prochains matchs",
      error: error.message,
    });
  }
};

const getLastSixMatches = async (req, res) => {
  try {
    // Récupérer les 6 derniers matchs joués avec des scores, triés par date décroissante
    const lastSixMatches = await Match.findAll({
      where: {
        homeScore: { [Op.ne]: null }, // homeScore n'est pas null
        awayScore: { [Op.ne]: null }, // awayScore n'est pas null
      },
      order: [["playedDate", "DESC"]], // Du plus récent au plus ancien
      limit: 6, // Limiter à 6 résultats
    });

    res.status(200).json({
      success: true,
      count: lastSixMatches.length,
      data: lastSixMatches,
    });
  } catch (error) {
    console.error("Erreur récupération des 6 derniers matchs:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des 6 derniers matchs",
      error: error.message,
    });
  }
};

// Récupérer tous les matchs
const getAllMatch = async (req, res) => {
  try {
    const allMatch = await Match.findAll({
      where: {
        playedDate: {
          [Op.gt]: new Date(),
        },
      },
    });
    res.status(200).json({
      success: true,
      data: allMatch,
    });
  } catch (error) {
    console.error("Erreur récupération des matchs:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des matchs",
      error: error.message,
    });
  }
};

// Récupérer les matchs d'un tournoi
const getTournamentMatches = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const matches = await Match.findAll({
      where: { tournamentId },
      include: [
        { model: Team, as: "homeTeam" },
        { model: Team, as: "awayTeam" },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({
      success: true,
      matches,
    });
  } catch (error) {
    console.error("Erreur récupération des matchs:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des matchs",
      error: error.message,
    });
  }
};

// Mettre à jour le score d'un match
const updateMatchScore = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { homeScore, awayScore } = req.body;

    if (homeScore === undefined || awayScore === undefined) {
      return res.status(400).json({
        success: false,
        message: "Les scores des deux équipes sont requis",
      });
    }

    // Rechercher le match
    const match = await Match.findByPk(id, {
      include: [
        { model: Tournament },
        { model: Team, as: "homeTeam" },
        { model: Team, as: "awayTeam" },
      ],
      transaction,
    });

    if (!match) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Match non trouvé",
      });
    }

    // Vérifier si le match est déjà terminé
    if (match.status === "completed") {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Ce match est déjà terminé et ne peut plus être modifié",
      });
    }

    // Mettre à jour le match avec les nouveaux scores
    await match.update(
      {
        homeScore,
        awayScore,
        status: "completed",
        playedDate: new Date(),
      },
      { transaction }
    );

    // Mettre à jour les statistiques des équipes
    const homeTeamStats = await TournamentTeam.findOne({
      where: {
        tournamentId: match.tournamentId,
        teamId: match.homeTeamId,
      },
      transaction,
    });

    const awayTeamStats = await TournamentTeam.findOne({
      where: {
        tournamentId: match.tournamentId,
        teamId: match.awayTeamId,
      },
      transaction,
    });

    // Mettre à jour les statistiques de l'équipe à domicile
    const homeMatchesPlayed = homeTeamStats.matchesPlayed + 1;
    let homeMatchesWon = homeTeamStats.matchesWon;
    let homeMatchesLost = homeTeamStats.matchesLost;
    let homeMatchesDraw = homeTeamStats.matchesDraw;
    let homePoints = homeTeamStats.points;

    if (homeScore > awayScore) {
      homeMatchesWon++;
      homePoints += 3; // 3 points pour une victoire
    } else if (homeScore < awayScore) {
      homeMatchesLost++;
    } else {
      homeMatchesDraw++;
      homePoints += 1; // 1 point pour un match nul
    }

    await homeTeamStats.update(
      {
        matchesPlayed: homeMatchesPlayed,
        matchesWon: homeMatchesWon,
        matchesLost: homeMatchesLost,
        matchesDraw: homeMatchesDraw,
        points: homePoints,
        goalsFor: homeTeamStats.goalsFor + homeScore,
        goalsAgainst: homeTeamStats.goalsAgainst + awayScore,
      },
      { transaction }
    );

    // Mettre à jour les statistiques de l'équipe à l'extérieur
    const awayMatchesPlayed = awayTeamStats.matchesPlayed + 1;
    let awayMatchesWon = awayTeamStats.matchesWon;
    let awayMatchesLost = awayTeamStats.matchesLost;
    let awayMatchesDraw = awayTeamStats.matchesDraw;
    let awayPoints = awayTeamStats.points;

    if (awayScore > homeScore) {
      awayMatchesWon++;
      awayPoints += 3; // 3 points pour une victoire
    } else if (awayScore < homeScore) {
      awayMatchesLost++;
    } else {
      awayMatchesDraw++;
      awayPoints += 1; // 1 point pour un match nul
    }

    await awayTeamStats.update(
      {
        matchesPlayed: awayMatchesPlayed,
        matchesWon: awayMatchesWon,
        matchesLost: awayMatchesLost,
        matchesDraw: awayMatchesDraw,
        points: awayPoints,
        goalsFor: awayTeamStats.goalsFor + awayScore,
        goalsAgainst: awayTeamStats.goalsAgainst + homeScore,
      },
      { transaction }
    );

    // Vérifier si tous les matchs sont terminés
    const totalMatchesCount = await Match.count({
      where: { tournamentId: match.tournamentId },
      transaction,
    });

    const completedMatchesCount = await Match.count({
      where: {
        tournamentId: match.tournamentId,
        status: "completed",
      },
      transaction,
    });

    // Si tous les matchs sont terminés, marquer le tournoi comme terminé
    if (totalMatchesCount === completedMatchesCount) {
      await Tournament.update(
        { status: "completed" },
        {
          where: { id: match.tournamentId },
          transaction,
        }
      );
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Score mis à jour avec succès",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Erreur mise à jour du score:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du score",
      error: error.message,
    });
  }
};

// Obtenir le classement général
const getGeneralStandings = async (req, res) => {
  try {
    // Récupérer toutes les équipes participant à des tournois
    const allTeamStats = await TournamentTeam.findAll({
      include: [{ model: Team }],
    });

    // Utiliser un Map pour regrouper les statistiques par équipe
    const teamStatsMap = new Map();

    // Agréger les statistiques pour chaque équipe
    allTeamStats.forEach((stat) => {
      const teamId = stat.teamId;

      if (!teamStatsMap.has(teamId)) {
        teamStatsMap.set(teamId, {
          team: stat.Team,
          totalPoints: 0,
          totalMatchesPlayed: 0,
          totalMatchesWon: 0,
          totalMatchesLost: 0,
          totalMatchesDraw: 0,
          totalGoalsFor: 0,
          totalGoalsAgainst: 0,
          tournaments: 0,
        });
      }

      const teamStats = teamStatsMap.get(teamId);
      teamStats.totalPoints += stat.points;
      teamStats.totalMatchesPlayed += stat.matchesPlayed;
      teamStats.totalMatchesWon += stat.matchesWon;
      teamStats.totalMatchesLost += stat.matchesLost;
      teamStats.totalMatchesDraw += stat.matchesDraw;
      teamStats.totalGoalsFor += stat.goalsFor;
      teamStats.totalGoalsAgainst += stat.goalsAgainst;
      teamStats.tournaments += 1;
    });

    // Convertir le Map en tableau et trier par points, puis par buts marqués
    const generalStandings = Array.from(teamStatsMap.values()).sort((a, b) => {
      // D'abord par points
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      // Ensuite par buts marqués
      if (b.totalGoalsFor !== a.totalGoalsFor) {
        return b.totalGoalsFor - a.totalGoalsFor;
      }
      // Ensuite par différence de buts (moins de buts encaissés est mieux)
      return a.totalGoalsAgainst - b.totalGoalsAgainst;
    });

    res.status(200).json({
      success: true,
      generalStandings,
    });
  } catch (error) {
    console.error("Erreur récupération du classement général:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du classement général",
      error: error.message,
    });
  }
};

// Obtenir le classement d'un tournoi
const getTournamentStandings = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    // Vérifier si le tournoi existe
    const tournament = await Tournament.findByPk(tournamentId);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournoi non trouvé",
      });
    }

    // Récupérer le classement
    const standings = await TournamentTeam.findAll({
      where: { tournamentId },
      include: [{ model: Team }],
      order: [
        ["points", "DESC"],
        ["goalsFor", "DESC"],
        ["goalsAgainst", "ASC"],
      ],
    });

    res.status(200).json({
      success: true,
      standings,
    });
  } catch (error) {
    console.error("Erreur récupération du classement:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du classement",
      error: error.message,
    });
  }
};

module.exports = {
  getUpcomingFiveMatches,
  getLastSixMatches,
  getAllMatch,
  getTournamentMatches,
  updateMatchScore,
  getGeneralStandings,
  getTournamentStandings,
};
