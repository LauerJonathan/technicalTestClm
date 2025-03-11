import { reactive, readonly } from "vue";
import apiClient from "../plugins/axiosConfig";

// État initial
const state = reactive({
  tournaments: [],
  currentTournament: null,
  tournamentMatches: [],
  tournamentStandings: [],
  isLoading: false,
  error: null,
  success: false,
});

// Méthodes
const methods = {
  async fetchAllTournaments() {
    state.isLoading = true;
    state.error = null;

    try {
      const response = await apiClient.get("tournaments");

      // Adapter selon la structure de réponse
      state.tournaments =
        response.data.tournaments || response.data.data || response.data;
      return state.tournaments;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la récupération des tournois";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  async createTournament(tournamentData) {
    state.isLoading = true;
    state.error = null;
    state.success = false;

    try {
      const response = await apiClient.post("tournaments", {
        name: tournamentData.name,
        date: tournamentData.date,
        description: tournamentData.description,
        status: tournamentData.status,
      });

      // Si la création réussit, ajouter le tournoi à la liste
      if (state.tournaments.length > 0) {
        state.tournaments.push(response.data.tournament || response.data);
      }

      state.success = true;
      return response.data.tournament || response.data;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la création du tournoi";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  async updateTournament(tournamentData) {
    state.isLoading = true;
    state.error = null;
    state.success = false;

    try {
      const response = await apiClient.put(`tournaments/${tournamentData.id}`, {
        name: tournamentData.name,
        date: tournamentData.date,
        description: tournamentData.description,
        status: tournamentData.status,
      });

      // Mettre à jour le tournoi dans la liste
      const updatedTournament = response.data.tournament || response.data;
      const index = state.tournaments.findIndex(
        (t) => t.id === updatedTournament.id
      );
      if (index !== -1) {
        state.tournaments[index] = updatedTournament;
      }

      state.success = true;
      return updatedTournament;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la mise à jour du tournoi";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  async deleteTournament(id) {
    state.isLoading = true;
    state.error = null;

    try {
      await apiClient.delete(`tournaments/${id}`);

      // Supprimer le tournoi de la liste
      const index = state.tournaments.findIndex((t) => t.id === id);
      if (index !== -1) {
        state.tournaments.splice(index, 1);
      }

      return true;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la suppression du tournoi";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  resetSuccess() {
    state.success = false;
  },

  clearError() {
    state.error = null;
  },
  async fetchTournamentById(id) {
    state.isLoading = true;
    state.error = null;

    try {
      const response = await apiClient.get(`tournaments/${id}`);
      const tournamentData = response.data.tournament || response.data;
      state.currentTournament = tournamentData;
      return tournamentData;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la récupération du tournoi";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  async fetchTournamentMatches(tournamentId) {
    state.isLoading = true;
    state.error = null;

    try {
      const response = await apiClient.get(
        `matches/tournaments/${tournamentId}`
      );
      const matchesData = response.data.matches || response.data;
      state.tournamentMatches = matchesData;
      return matchesData;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la récupération des matchs";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  async fetchTournamentStandings(tournamentId) {
    state.isLoading = true;
    state.error = null;

    try {
      const response = await apiClient.get(
        `matches/tournaments/${tournamentId}/standings`
      );
      const standingsData = response.data.standings || response.data;
      state.tournamentStandings = standingsData;
      return standingsData;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la récupération du classement";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  async registerTeamToTournament(tournamentId, teamId) {
    state.isLoading = true;
    state.error = null;
    state.success = false;

    try {
      const response = await apiClient.post("teams/register", {
        tournamentId,
        teamId,
      });

      state.success = true;
      return response.data;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de l'inscription de l'équipe";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  async removeTeamFromTournament(tournamentId, teamId) {
    state.isLoading = true;
    state.error = null;

    try {
      await apiClient.delete(`tournaments/${tournamentId}/teams/${teamId}`);
      return true;
    } catch (error) {
      state.error =
        error.response?.data?.message || "Erreur lors du retrait de l'équipe";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  async generateMatches(tournamentId) {
    state.isLoading = true;
    state.error = null;

    try {
      const response = await apiClient.post(
        `tournaments/${tournamentId}/generate-matches`
      );
      return response.data;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la génération des matchs";
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
      return response.data;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la mise à jour du résultat";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },
};

// Exposer un état en lecture seule et les méthodes
export default {
  state: readonly(state),
  ...methods,
};
