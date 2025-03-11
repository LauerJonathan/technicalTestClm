<script setup>
import { ref, onMounted } from "vue";
import field from "../components/cards/field.vue";
import matchesStore from "../store/matchesStore"; // Store des matchs
import teamsStore from "../store/teamsStore"; // Store des équipes
import Standings from "../components/standings.vue";

// Liste des matchs récupérés depuis le backend (les 6 derniers matchs)
const matchesList = ref([]);

// Fonction pour récupérer les 6 derniers matchs et enrichir avec les noms des équipes
const fetchPreviousMatches = async () => {
  try {
    // Récupérer les derniers matchs
    const previousMatches = await matchesStore.fetchPrevious();
    console.log("Données récupérées :", previousMatches);

    // Filtrer les matchs qui ont des scores valides
    matchesList.value = previousMatches
      .filter(
        (match) =>
          match.homeScore !== undefined && match.awayScore !== undefined
      )
      .map((match) => {
        return {
          ...match,
          homeTeamName: teamsStore.getTeamName(match.homeTeamId),
          awayTeamName: teamsStore.getTeamName(match.awayTeamId),
        };
      });

    // Si aucun match n'est trouvé après le filtrage
    if (matchesList.value.length === 0) {
      console.log("Aucun match valide trouvé.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des matchs : ", error);
  }
};

// Appel de la fonction au montage du composant
onMounted(() => {
  fetchPreviousMatches();
});
</script>

<template>
  <h1>Les matchs passés</h1>

  <!-- Afficher un message si aucun match n'est disponible -->
  <section v-if="matchesList.length === 0" class="no-matches">
    <p>Aucun match récent disponible.</p>
  </section>

  <!-- Affichage des matchs avec les noms des équipes -->
  <section class="cardsContainer" v-else>
    <div class="card" v-for="match in matchesList" :key="match.id">
      <!-- Passage des matchs avec noms d'équipes -->
      <field :match="match" :score="true" />
    </div>
  </section>

  <section>
    <h1>Classement général :</h1>
    <standings />
  </section>
</template>

<style scoped>
.cardsContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 80%;
  gap: 5%;
  margin: 0 auto;
}
.card {
  display: block;
  width: 30%;
  margin: 40px 0;
}
.no-matches {
  text-align: center;
  font-size: 18px;
  color: #666;
  margin: 20px 0;
}
.standingInfos {
  display: flex;
  width: 90%;
  margin: 0 auto;
  gap: 50px;
}
</style>
