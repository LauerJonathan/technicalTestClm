<template>
  <div class="registration-container">
    <h1>Inscription d'équipe</h1>
    <p class="registration-subtitle">
      Complétez le formulaire ci-dessous pour inscrire votre équipe au tournoi
      de babyfoot
    </p>

    <form @submit.prevent="submitForm" class="registration-form">
      <!-- Nom de l'équipe -->
      <div class="form-field">
        <label for="teamName">Nom de l'équipe *</label>
        <input
          id="teamName"
          v-model="team.name"
          type="text"
          required
          placeholder="Les Invincibles"
          :class="{ error: errors.name }" />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <!-- Sélection du tournoi -->
      <div class="form-field">
        <label for="tournamentSelect">Sélectionner un tournoi *</label>
        <select
          id="tournamentSelect"
          v-model="team.tournamentId"
          required
          :class="{ error: errors.tournamentId }">
          <option value="" disabled selected>Choisir un tournoi...</option>
          <option
            v-for="tournament in availableTournaments"
            :key="tournament.id"
            :value="tournament.id">
            {{ tournament.name }} - {{ formatDate(tournament.date) }}
          </option>
        </select>
        <span v-if="errors.tournamentId" class="error-message">{{
          errors.tournamentId
        }}</span>
        <span class="field-info"
          >Choisissez le tournoi auquel vous souhaitez participer</span
        >
      </div>

      <!-- Joueurs côte à côté -->
      <div class="players-container">
        <div class="player-section">
          <h2>Joueur 1</h2>
          <div class="form-field">
            <label for="player1Name">Nom complet du joueur 1 *</label>
            <input
              id="player1Name"
              v-model="team.player1Name"
              type="text"
              required
              placeholder="Thomas Dupont"
              :class="{ error: errors.player1Name }" />
            <span v-if="errors.player1Name" class="error-message">
              {{ errors.player1Name }}
            </span>
          </div>
        </div>

        <div class="player-section">
          <h2>Joueur 2</h2>
          <div class="form-field">
            <label for="player2Name">Nom complet du joueur 2 *</label>
            <input
              id="player2Name"
              v-model="team.player2Name"
              type="text"
              required
              placeholder="Marie Martin"
              :class="{ error: errors.player2Name }" />
            <span v-if="errors.player2Name" class="error-message">
              {{ errors.player2Name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Conditions -->
      <div class="form-field checkbox-field">
        <input
          id="terms"
          v-model="team.termsAccepted"
          type="checkbox"
          required />
        <label for="terms">
          J'accepte les
          <a href="#" @click.prevent="showTerms">règles du tournoi</a> et le
          règlement intérieur *
        </label>
        <span v-if="errors.termsAccepted" class="error-message">
          {{ errors.termsAccepted }}
        </span>
      </div>

      <!-- Bouton de soumission -->
      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <span v-if="isSubmitting">Inscription en cours...</span>
          <span v-else>S'inscrire</span>
        </button>
      </div>
    </form>

    <!-- Modal de confirmation -->
    <div v-if="showConfirmation" class="modal-overlay">
      <div class="modal-content">
        <h2>Inscription réussie !</h2>
        <p>
          Votre équipe <strong>{{ team.name }}</strong> a été inscrite avec
          succès au tournoi.
        </p>
        <button @click="closeConfirmation" class="modal-btn">Fermer</button>
      </div>
    </div>

    <!-- Modal pour les termes -->
    <div v-if="showTermsModal" class="modal-overlay">
      <div class="modal-content terms-modal">
        <h2>Règles du tournoi</h2>
        <div class="terms-content">
          <h3>Règlement du tournoi de babyfoot</h3>
          <ol>
            <li>Chaque équipe est composée de deux joueurs.</li>
            <li>
              Les matchs se jouent en 10 points gagnants avec 2 points d'écart.
            </li>
            <li>
              Les équipes doivent être présentes 10 minutes avant l'heure prévue
              de leur match.
            </li>
            <li>
              Une absence à un match programmé entraîne un forfait (score 10-0).
            </li>
            <li>Les décisions des arbitres sont définitives.</li>
            <li>
              Tout comportement antisportif peut entraîner une disqualification.
            </li>
            <li>
              Les joueurs doivent respecter le matériel mis à disposition.
            </li>
            <li>
              En cas d'égalité dans le tournoi, les équipes seront départagées
              par la différence de buts.
            </li>
            <li>
              L'organisation se réserve le droit de modifier le planning en cas
              de nécessité.
            </li>
            <li>
              Les informations personnelles collectées ne seront utilisées que
              dans le cadre du tournoi.
            </li>
          </ol>
        </div>
        <button @click="closeTerms" class="modal-btn">J'ai compris</button>
      </div>
    </div>
  </div>
</template>

<script>
import teamsStore from "../store/teamsStore";
import tournamentStore from "../store/tournamentStore";

export default {
  name: "TeamRegistration",
  data() {
    return {
      team: {
        name: "",
        player1Name: "",
        player2Name: "",
        tournamentId: "",
        termsAccepted: false,
      },
      errors: {
        name: "",
        player1Name: "",
        player2Name: "",
        tournamentId: "",
        termsAccepted: "",
      },
      availableTournaments: [],
      isSubmitting: false,
      showConfirmation: false,
      showTermsModal: false,
    };
  },
  computed: {
    // Accès au store d'équipes
    teamsStore() {
      return teamsStore;
    },
  },
  methods: {
    async loadAvailableTournaments() {
      try {
        // Charger tous les tournois disponibles pour l'inscription
        let availableTournaments = await tournamentStore.fetchAllTournaments();
        availableTournaments = availableTournaments.filter(
          (tournament) => tournament.status == "open"
        );
        this.availableTournaments = availableTournaments;
      } catch (error) {
        console.error("Erreur lors du chargement des tournois:", error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    validateForm() {
      let isValid = true;
      // Reset errors
      this.errors = {
        name: "",
        player1Name: "",
        player2Name: "",
        tournamentId: "",
        termsAccepted: "",
      };

      // Tournament validation
      if (!this.team.tournamentId) {
        this.errors.tournamentId = "Veuillez sélectionner un tournoi";
        isValid = false;
      }

      // Team name validation
      if (!this.team.name.trim()) {
        this.errors.name = "Le nom de l'équipe est requis";
        isValid = false;
      } else if (this.team.name.length < 3) {
        this.errors.name =
          "Le nom de l'équipe doit contenir au moins 3 caractères";
        isValid = false;
      }

      // Player 1 validation
      if (!this.team.player1Name.trim()) {
        this.errors.player1Name = "Le nom du joueur 1 est requis";
        isValid = false;
      } else if (!this.team.player1Name.includes(" ")) {
        this.errors.player1Name =
          "Veuillez entrer le nom complet (prénom et nom)";
        isValid = false;
      }

      // Player 2 validation
      if (!this.team.player2Name.trim()) {
        this.errors.player2Name = "Le nom du joueur 2 est requis";
        isValid = false;
      } else if (!this.team.player2Name.includes(" ")) {
        this.errors.player2Name =
          "Veuillez entrer le nom complet (prénom et nom)";
        isValid = false;
      }

      // Terms acceptance validation
      if (!this.team.termsAccepted) {
        this.errors.termsAccepted = "Vous devez accepter les règles du tournoi";
        isValid = false;
      }

      return isValid;
    },
    async submitForm() {
      if (!this.validateForm()) {
        // Scroll to first error
        const firstError = document.querySelector(".error-message");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      this.isSubmitting = true;

      try {
        // Créer d'abord l'équipe
        const createdTeam = await this.teamsStore.createTeam({
          name: this.team.name,
          player1Name: this.team.player1Name,
          player2Name: this.team.player2Name,
        });

        // Si l'équipe a été créée avec succès, l'inscrire au tournoi
        if (createdTeam && this.team.tournamentId) {
          await tournamentStore.registerTeamToTournament(
            this.team.tournamentId,
            createdTeam.id
          );
        }

        // Vérifier si la création a réussi
        if (this.teamsStore.state.registrationSuccess) {
          // Afficher la modal de confirmation
          this.showConfirmation = true;

          // Réinitialiser le formulaire
          this.team = {
            name: "",
            player1Name: "",
            player2Name: "",
            tournamentId: "",
            termsAccepted: false,
          };
        }
      } catch (error) {
        console.error("Erreur d'inscription:", error);
        // L'erreur est déjà gérée dans le store
      } finally {
        this.isSubmitting = false;
      }
    },
    closeConfirmation() {
      this.showConfirmation = false;
      // Réinitialiser le statut de succès dans le store
      this.teamsStore.resetRegistrationStatus();
    },
    showTerms() {
      this.showTermsModal = true;
    },
    closeTerms() {
      this.showTermsModal = false;
    },
  },
  mounted() {
    // Charger les tournois disponibles au montage du composant
    this.loadAvailableTournaments();
  },
  watch: {
    // Observer les erreurs du store et les afficher si nécessaire
    "teamsStore.state.error": {
      handler(newError) {
        if (newError) {
          // Vous pourriez créer un système de notification ici
          console.error("Erreur du store:", newError);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.registration-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px 20px;
  background-color: #121212;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

h1 {
  color: #ef854d;
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.8rem;
}

.registration-subtitle {
  text-align: center;
  color: #ccc;
  margin-bottom: 30px;
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Styles pour le conteneur des joueurs */
.players-container {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.player-section {
  flex: 1;
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 5px;
  padding: 15px;
}

.player-section h2 {
  color: #ef854d;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

label {
  color: white;
  font-weight: bold;
}

input[type="text"],
input[type="email"],
select {
  padding: 12px;
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

select {
  appearance: none; /* Supprime l'apparence par défaut */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ef854d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

option {
  background-color: #1e1e1e;
  color: white;
}

input[type="text"]:focus,
input[type="email"]:focus,
select:focus {
  border-color: #ef854d;
  outline: none;
  box-shadow: 0 0 0 2px rgba(239, 133, 77, 0.3);
}

input.error,
select.error {
  border-color: #f44336;
}

.error-message {
  color: #f44336;
  font-size: 0.85rem;
}

.field-info {
  color: #999;
  font-size: 0.85rem;
  margin-top: 5px;
}

.checkbox-field {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.checkbox-field label {
  font-weight: normal;
}

.checkbox-field a {
  color: #ef854d;
  text-decoration: none;
}

.checkbox-field a:hover {
  text-decoration: underline;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.submit-btn {
  background-color: #ef854d;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.submit-btn:hover {
  background-color: #d67642;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
  transform: none;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.modal-content h2 {
  color: #ef854d;
  margin-bottom: 20px;
}

.modal-content p {
  color: white;
  margin-bottom: 10px;
}

.modal-btn {
  background-color: #ef854d;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 25px;
  margin-top: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-btn:hover {
  background-color: #d67642;
}

.terms-modal {
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
}

.terms-content {
  text-align: left;
  color: white;
  max-height: 50vh;
  overflow-y: auto;
  padding: 15px;
  border: 1px solid #333;
  border-radius: 5px;
  margin: 20px 0;
}

.terms-content h3 {
  color: #ef854d;
  margin-bottom: 15px;
}

.terms-content ol {
  padding-left: 20px;
}

.terms-content li {
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .registration-container {
    padding: 20px 15px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .players-container {
    flex-direction: column;
  }

  .modal-content {
    padding: 20px;
    width: 95%;
  }
}
</style>
