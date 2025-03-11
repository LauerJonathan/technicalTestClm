<script setup>
import { ref, onMounted } from "vue";
import standingsStore from "../store/standingsStore";

// État local pour afficher le chargement et les erreurs
const isLoading = ref(false);
const error = ref(null);

// Fonction pour formater les noms des joueurs
const formatName = (fullName) => {
  // Vérifie si le nom est valide
  if (!fullName || typeof fullName !== "string") {
    return "";
  }

  // Nettoyage et division du nom
  const parts = fullName.trim().split(" ");

  // Si le nom ne contient pas d'espace, le retourner tel quel
  if (parts.length === 1) {
    return parts[0];
  }

  // Récupérer le prénom et l'initiale du nom
  const firstName = parts[0];
  const lastInitial = parts[1].charAt(0).toUpperCase();

  // Retourner le format désiré
  return `${firstName}.${lastInitial}`;
};

// Fonction pour calculer la différence de buts
const calculBd = (a, b) => {
  return a - b;
};

// Charger les données du classement au montage du composant
onMounted(async () => {
  isLoading.value = true;
  error.value = null;

  try {
    await standingsStore.fetchGeneralStandings();
  } catch (err) {
    error.value = err;
    console.error("Erreur lors du chargement du classement:", err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <!-- Indicateur de chargement -->
  <div v-if="isLoading" class="loading">
    <div class="spinner"></div>
    <p>Chargement du classement...</p>
  </div>

  <!-- Message d'erreur -->
  <div v-else-if="error" class="error-message">
    <p>{{ error }}</p>
    <button
      @click="standingsStore.fetchGeneralStandings()"
      class="retry-button">
      Réessayer
    </button>
  </div>

  <!-- Aucune donnée disponible -->
  <div
    v-else-if="
      !standingsStore.state.generalStandings ||
      standingsStore.state.generalStandings.length === 0
    "
    class="no-data">
    <p>Aucune donnée de classement disponible</p>
  </div>

  <!-- Tableau du classement -->
  <table v-else>
    <thead>
      <tr>
        <th>Team</th>
        <th>Joueurs</th>
        <th>Total de point</th>
        <th>Victoire</th>
        <th>Défaite</th>
        <th>Différence de but</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="team in standingsStore.state.generalStandings"
        :key="team.team.id">
        <td>{{ team.team.name }}</td>
        <td>
          {{
            `${formatName(team.team.player1Name)} & ${formatName(
              team.team.player2Name
            )}`
          }}
        </td>
        <td>{{ team.totalPoints }}</td>
        <td>{{ team.totalMatchesWon }}</td>
        <td>{{ team.totalMatchesLost }}</td>
        <td :data-value="calculBd(team.totalGoalsFor, team.totalGoalsAgainst)">
          {{ calculBd(team.totalGoalsFor, team.totalGoalsAgainst) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
h1 {
  color: #ef854d;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Styles pour le chargement et les messages d'erreur */
.loading,
.error-message,
.no-data {
  text-align: center;
  padding: 20px;
  margin: 20px auto;
  width: 75%;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(239, 133, 77, 0.1);
  border-radius: 50%;
  border-top: 4px solid #ef854d;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
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
  color: #f44336;
}

.retry-button {
  background-color: #ef854d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #d67642;
}

.no-data {
  color: #777;
  font-style: italic;
}

table {
  width: 75%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  margin-bottom: 2rem;
  background-color: #121212;
}

thead {
  background-color: #1e1e1e;
  color: #ef854d;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #333;
}

th {
  font-weight: bold;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
  text-transform: uppercase;
}

tr:last-child td {
  border-bottom: none;
}

tbody tr {
  transition: background-color 0.3s;
  height: max-content;
}

tbody tr:hover {
  background-color: #1e1e1e;
}

tbody td {
  color: #fff;
}

/* Styles spécifiques pour certaines colonnes */
td:nth-child(3),
td:nth-child(4),
td:nth-child(5) {
  text-align: center;
}

/* Style pour les différences de buts positives/négatives */
td:last-child {
  font-weight: bold;
  text-align: center;
}

tr td:last-child:not(:empty) {
  color: #4caf50; /* Vert pour les différences positives */
}

tr td:last-child:not(:empty):before {
  content: "+";
}

tr td:last-child[data-value^="-"] {
  color: #f44336; /* Rouge pour les différences négatives */
}

tr td:last-child[data-value^="-"]:before {
  content: "";
}

/* Mise en évidence du podium */
tbody tr:nth-child(1) {
  background-color: rgba(255, 215, 0, 0.1); /* Or */
}

tbody tr:nth-child(2) {
  background-color: rgba(192, 192, 192, 0.1); /* Argent */
}

tbody tr:nth-child(3) {
  background-color: rgba(205, 127, 50, 0.1); /* Bronze */
}

@media (max-width: 768px) {
  table {
    font-size: 0.9rem;
  }

  th,
  td {
    padding: 8px 10px;
  }

  th:nth-child(5),
  td:nth-child(5),
  th:nth-child(6),
  td:nth-child(6) {
    display: none; /* Cache certaines colonnes sur mobile */
  }
}
</style>
