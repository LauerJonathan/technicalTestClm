<script setup>
import { ref, onMounted, computed } from "vue";
import field from "./cards/field.vue";
import matchesStore from "../store/matchesStore";

// Accès aux données du store
const isLoading = computed(() => matchesStore.state.isLoading);
const hasError = computed(() => matchesStore.state.error);
const errorMessage = computed(() => matchesStore.state.error);
const matchesList = computed(() => matchesStore.state.upcomingMatches);

// Fonction pour charger les matchs depuis l'API
const loadMatches = async () => {
  try {
    await matchesStore.fetchUpcomingMatches();
  } catch (error) {
    console.error("Erreur lors du chargement des matchs :", error);
  }
};

// Charger les matchs au montage du composant
onMounted(loadMatches);
</script>

<template>
  <section class="cardsContainer">
    <!-- Indicateur de chargement -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Chargement des matchs...</p>
    </div>

    <!-- Message d'erreur -->
    <div v-if="hasError" class="error-message">
      <p>{{ errorMessage }}</p>
      <button @click="loadMatches" class="retry-button">Réessayer</button>
    </div>

    <!-- Liste des matchs -->
    <div class="card" v-for="match in matchesList" :key="match.id">
      <field :match="match" :score="false" />
    </div>
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
@media screen and (max-width: 900px) {
  .card {
    width: calc(50% - 20px);
  }
}

@media screen and (max-width: 700px) {
  .card {
    width: calc(100%);
  }
}
</style>
