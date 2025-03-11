const express = require("express");
const { authenticateAdmin } = require("../middleware/auth");
const {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  generateMatches,
} = require("../controllers/tournamentController");

const router = express.Router();

// Routes publiques
router.get("/", getAllTournaments);
router.get("/:id", getTournamentById);

// Routes protégées (administrateurs uniquement)
router.post("/", authenticateAdmin, createTournament);
router.put("/:id", authenticateAdmin, updateTournament);
router.delete("/:id", authenticateAdmin, deleteTournament);
router.post("/:id/generate-matches", authenticateAdmin, generateMatches);

module.exports = router;
