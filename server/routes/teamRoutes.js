const express = require("express");
const { authenticateAdmin } = require("../middleware/auth");
const {
  createTeam,
  getAllTeams,
  addTeamToTournament,
  removeTeamFromTournament,
} = require("../controllers/teamController");

const router = express.Router();

// Routes publiques
router.get("/", getAllTeams);
router.post("/", createTeam);
router.post("/register", addTeamToTournament);

// Routes protégées (administrateurs uniquement)
router.delete(
  "/:teamId/tournaments/:tournamentId",
  authenticateAdmin,
  removeTeamFromTournament
);

module.exports = router;
