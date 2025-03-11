import { reactive, readonly } from "vue";
import apiClient from "../plugins/axiosConfig";

// État initial
const state = reactive({
  teams: [],
  isLoading: false,
  error: null,
  registrationSuccess: false,
  lastFetched: null,
});

// Méthodes
const methods = {
  async fetchAllTeams() {
    state.isLoading = true;
    state.error = null;

    try {
      const response = await apiClient.get("teams");
      // Extraire le tableau teams de la réponse
      if (response.data.success && Array.isArray(response.data.teams)) {
        state.teams = response.data.teams;
      } else {
        throw new Error("Format de données inattendu");
      }
      return state.teams;
    } catch (error) {
      state.error =
        error.message || "Erreur lors de la récupération des équipes";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },
  async createTeam(teamData) {
    state.isLoading = true;
    state.error = null;
    state.registrationSuccess = false;

    try {
      const response = await apiClient.post("teams", {
        name: teamData.name,
        player1Name: teamData.player1Name,
        player2Name: teamData.player2Name,
      });

      // Ajouter la nouvelle équipe à la liste si elle existe déjà
      if (state.teams.length > 0) {
        state.teams.push(response.data.team);
      }

      state.registrationSuccess = true;
      return response.data.team;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la création de l'équipe";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },
  getTeamName: (teamId) => {
    const team = state.teams.find((t) => t.id === teamId);
    return team ? team.name : "Équipe inconnue";
  },

  resetRegistrationStatus() {
    state.registrationSuccess = false;
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
