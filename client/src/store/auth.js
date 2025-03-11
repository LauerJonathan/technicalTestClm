// src/store/auth.js
import { reactive, readonly } from "vue";
import apiClient from "../plugins/axiosConfig";

// État initial
const state = reactive({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
});

// Méthodes
const methods = {
  async login(username, password) {
    state.isLoading = true;
    state.error = null;

    try {
      const response = await apiClient.post("admin/login", {
        email: username,
        password,
      });

      state.user = response.data.admin;
      state.token = response.data.token;
      state.isAuthenticated = true;

      // Stockage dans localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.admin));

      return response.data;
    } catch (error) {
      state.error = error.response?.data?.message || "Erreur de connexion";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  logout() {
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
