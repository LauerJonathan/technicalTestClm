import { reactive, readonly } from "vue";
import apiClient from "../plugins/axiosConfig";

// État initial
const state = reactive({
  generalStandings: [],
  isLoading: false,
  error: null,
});

// Méthodes
const methods = {
  async fetchGeneralStandings() {
    state.isLoading = true;
    state.error = null;

    try {
      const response = await apiClient.get("matches/standings/general");
      if (response.data.success && response.data.generalStandings) {
        state.generalStandings = response.data.generalStandings;
      } else {
        state.generalStandings = response.data.data || response.data;
      }

      return state.generalStandings;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la récupération du classement général";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  // Fonction pour récupérer le classement d'un tournoi spécifique
  async fetchTournamentStandings(tournamentId) {
    state.isLoading = true;
    state.error = null;

    try {
      const response = await apiClient.get(
        `tournaments/${tournamentId}/standings`
      );

      return response.data.standings || response.data.data || response.data;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        `Erreur lors de la récupération du classement du tournoi ${tournamentId}`;
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  // Utilitaire pour calculer la différence de buts
  calculateGoalDifference(goalsFor, goalsAgainst) {
    return goalsFor - goalsAgainst;
  },

  // Réinitialiser les erreurs
  clearError() {
    state.error = null;
  },
};

// Exposer un état en lecture seule et les méthodes
export default {
  state: readonly(state),
  ...methods,
};
