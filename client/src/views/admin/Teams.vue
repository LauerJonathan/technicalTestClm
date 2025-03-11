<template>
  <div class="teams-list-container">
    <h1>Liste des équipes</h1>

    <!-- Loader -->
    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>Chargement des équipes...</p>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
      <button @click="loadTeams" class="retry-button">Réessayer</button>
    </div>

    <!-- Aucune équipe -->
    <div v-else-if="teams.length === 0" class="no-teams">
      <p>Aucune équipe n'est enregistrée pour le moment.</p>
    </div>

    <!-- Liste des équipes -->
    <div v-else class="teams-grid">
      <div v-for="team in teams" :key="team.id" class="team-card">
        <div class="team-header">
          <h2>{{ team.name }}</h2>
        </div>
        <div class="team-details">
          <div class="players">
            <div class="player">
              <span class="player-label">Joueur 1:</span>
              <span class="player-name">{{ team.player1Name }}</span>
            </div>
            <div class="player">
              <span class="player-label">Joueur 2:</span>
              <span class="player-name">{{ team.player2Name }}</span>
            </div>
          </div>
          <div class="team-info">
            <p class="created-at">
              <span>Inscrit le:</span> {{ formatDate(team.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import teamsStore from "../../store/teamsStore";

export default {
  name: "TeamsList",
  data() {
    return {
      loading: false,
      errorMessage: null,
      teams: [],
    };
  },
  mounted() {
    this.loadTeams();
  },
  methods: {
    async loadTeams() {
      this.loading = true;
      this.errorMessage = null;

      try {
        const teamsData = await teamsStore.fetchAllTeams();
        this.teams = teamsData;
      } catch (error) {
        console.error("Erreur lors du chargement des équipes:", error);
        this.errorMessage =
          typeof error === "string"
            ? error
            : "Erreur lors du chargement des équipes";
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return "Date inconnue";

      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
};
</script>

<style scoped>
.teams-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

h1 {
  color: #ef854d;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(239, 133, 77, 0.3);
  border-top: 4px solid #ef854d;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  color: #f44336;
  padding: 20px;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: 5px;
  margin-bottom: 20px;
}

.retry-button {
  background-color: #ef854d;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-top: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #d67642;
}

.no-teams {
  text-align: center;
  padding: 40px 0;
  color: #ccc;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.team-card {
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}

.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.team-header {
  background-color: #2a2a2a;
  padding: 15px;
  border-bottom: 2px solid #ef854d;
}

.team-header h2 {
  margin: 0;
  color: #ef854d;
  font-size: 1.4rem;
}

.team-details {
  padding: 20px;
}

.players {
  margin-bottom: 15px;
}

.player {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.player-label {
  color: #aaa;
  width: 80px;
  font-weight: bold;
}

.player-name {
  color: white;
}

.team-info {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #333;
}

.created-at {
  color: #aaa;
  font-size: 0.9rem;
  margin: 0;
}

.created-at span {
  color: #888;
}

@media (max-width: 768px) {
  .teams-grid {
    grid-template-columns: 1fr;
  }

  .team-card {
    max-width: 100%;
  }
  .teams-list-container {
    padding: 0;
  }
}
</style>
