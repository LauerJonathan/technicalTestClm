<script setup>
import { onMounted } from "vue";
import teamsStore from "../../store/teamsStore"; // Import du store

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
};

const props = defineProps({
  match: {
    type: Object,
    required: true,
  },
  score: {
    type: Boolean,
    required: true,
  },
});

// Charger les équipes si elles ne sont pas déjà récupérées
onMounted(() => {
  if (teamsStore.state.teams.length === 0) {
    teamsStore.fetchAllTeams();
  }
});

// Récupérer les noms des équipes directement depuis le store
const getTeamName = (teamId) => teamsStore.getTeamName(teamId);
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
    <!-- Cadre de la table de babyfoot -->
    <rect
      x="100"
      y="50"
      width="600"
      height="300"
      rx="10"
      fill="#5d4037"
      stroke="#3e2723"
      stroke-width="8" />

    <!-- Surface de jeu -->
    <rect
      x="120"
      y="70"
      width="560"
      height="260"
      fill="#4caf50"
      stroke="#388e3c"
      stroke-width="4" />

    <!-- Ligne centrale -->
    <line x1="400" y1="70" x2="400" y2="330" stroke="white" stroke-width="4" />

    <!-- Cercle central -->
    <circle
      cx="400"
      cy="200"
      r="40"
      fill="none"
      stroke="white"
      stroke-width="4" />

    <!-- Zones de but -->
    <rect
      x="120"
      y="150"
      width="40"
      height="100"
      fill="none"
      stroke="white"
      stroke-width="4" />
    <rect
      x="640"
      y="150"
      width="40"
      height="100"
      fill="none"
      stroke="white"
      stroke-width="4" />

    <!-- Joueurs équipe gauche (orange) -->
    <circle
      cx="180"
      cy="130"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="180"
      cy="200"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="180"
      cy="270"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />

    <circle
      cx="260"
      cy="150"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="260"
      cy="250"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />

    <circle
      cx="340"
      cy="120"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="340"
      cy="200"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="340"
      cy="280"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />

    <!-- Joueurs équipe droite (bleu) -->
    <circle
      cx="460"
      cy="120"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="460"
      cy="200"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="460"
      cy="280"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />

    <circle
      cx="540"
      cy="150"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="540"
      cy="250"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />

    <circle
      cx="620"
      cy="130"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="620"
      cy="200"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="620"
      cy="270"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />

    <!-- Nom des équipes -->
    <text
      x="220"
      y="30"
      font-family="Arial"
      font-size="24"
      font-weight="bold"
      fill="#ef854d"
      text-anchor="middle">
      {{ getTeamName(match.homeTeamId) }} {{ winner === "home" ? "🚀" : "" }}
    </text>
    <text
      x="580"
      y="30"
      font-family="Arial"
      font-size="24"
      font-weight="bold"
      fill="#2196f3"
      text-anchor="middle">
      {{ getTeamName(match.awayTeamId) }} {{ winner === "away" ? "🚀" : "" }}
    </text>

    <!-- Score ou date du match -->
    <rect
      x="350"
      y="10"
      width="100"
      height="40"
      fill="#121212"
      stroke="#ef854d"
      stroke-width="2"
      rx="5" />
    <text
      v-if="!score"
      x="400"
      y="38"
      font-family="Arial"
      font-size="20"
      font-weight="bold"
      fill="#ffffff"
      text-anchor="middle">
      {{ formatDate(match.scheduledDate) }}
    </text>
    <g v-if="score">
      <text
        x="370"
        y="38"
        font-family="Arial"
        font-size="24"
        font-weight="bold"
        fill="#ef854d">
        {{ match.homeScore !== null ? match.homeScore : "--" }}
      </text>
      <text
        x="400"
        y="38"
        font-family="Arial"
        font-size="24"
        font-weight="bold"
        fill="#ffffff">
        -
      </text>
      <text
        x="420"
        y="38"
        font-family="Arial"
        font-size="24"
        font-weight="bold"
        fill="#2196f3">
        {{ match.awayScore !== null ? match.awayScore : "--" }}
      </text>
    </g>

    <!-- Numéro de terrain (si dispo) -->
    <g v-if="match.location">
      <rect
        x="350"
        y="360"
        width="100"
        height="30"
        rx="5"
        fill="#121212"
        stroke="#ef854d"
        stroke-width="2" />
      <text
        x="400"
        y="382"
        font-family="Arial"
        font-size="16"
        font-weight="bold"
        fill="#ffffff"
        text-anchor="middle">
        {{ match.location }}
      </text>
    </g>
  </svg>
</template>
