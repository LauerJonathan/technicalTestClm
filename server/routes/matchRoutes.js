const express = require("express");
const { authenticateAdmin } = require("../middleware/auth");
const {
  getTournamentMatches,
  updateMatchScore,
  getTournamentStandings,
  getAllMatch,
  getGeneralStandings,
  getUpcomingFiveMatches,
  getLastSixMatches,
} = require("../controllers/matchController");

const router = express.Router();

// Routes publiques
router.get("/upcoming", getUpcomingFiveMatches);
router.get("/previous", getLastSixMatches);
router.get("/all", getAllMatch);
router.get("/tournaments/:tournamentId", getTournamentMatches);
router.get("/tournaments/:tournamentId/standings", getTournamentStandings);
router.get("/standings/general", getGeneralStandings);

// Routes protégées (administrateurs uniquement)
router.put("/:id/score", authenticateAdmin, updateMatchScore);

module.exports = router;
