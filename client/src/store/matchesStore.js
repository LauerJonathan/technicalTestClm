import { reactive, readonly } from "vue";
import apiClient from "../plugins/axiosConfig";

// État initial
const state = reactive({
  upcomingMatches: [],
  isLoading: false,
  error: null,
});

const methods = {
  async fetchAllMatches() {
    state.isLoading = true;
    state.error = null;

    try {
      const response = await apiClient.get("matches/all");

      state.upcomingMatches = response.data.data || response.data;
      return state.upcomingMatches;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la récupération des prochains matchs";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },
  async fetchUpcomingMatches() {
    state.isLoading = true;
    state.error = null;

    try {
      const response = await apiClient.get("matches/upcoming");

      state.upcomingMatches = response.data.data || response.data;
      return state.upcomingMatches;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la récupération des prochains matchs";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  async fetchPrevious() {
    state.isLoading = true;
    state.error = null;

    try {
      const response = await apiClient.get("matches/previous");

      state.fetchPrevious = response.data.data || response.data;
      return state.fetchPrevious;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la récupération des derniers matchs";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  async updateMatchResult(matchId, homeScore, awayScore) {
    state.isLoading = true;
    state.error = null;

    try {
      const response = await apiClient.put(`matches/${matchId}/score`, {
        homeScore,
        awayScore,
      });

      // Mettre à jour le match dans la liste si présent
      const updatedMatch = response.data.match || response.data;
      const index = state.upcomingMatches.findIndex((m) => m.id === matchId);
      if (index !== -1) {
        state.upcomingMatches.splice(index, 1); // Enlever le match qui n'est plus à venir
      }

      return updatedMatch;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la mise à jour du résultat";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  clearError() {
    state.error = null;
  },
};

// Exposer un état en lecture seule et les méthodes
export default {
  state: readonly(state),
  ...methods,
};
