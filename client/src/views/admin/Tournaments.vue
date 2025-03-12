<template>
  <div class="tournaments-page">
    <div class="page-header">
      <div class="header-title">
        <h2>Gestion des tournois</h2>
        <p class="subtitle">Créez et gérez vos tournois de babyfoot</p>
      </div>
      <div class="header-actions">
        <button class="create-btn" @click="showCreateModal = true">
          <span class="icon">+</span>
          Créer un tournoi
        </button>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="filters">
      <div class="search">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un tournoi..."
          @input="filterTournaments" />
      </div>
      <div class="filter-group">
        <select v-model="statusFilter" @change="filterTournaments">
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="open">Inscriptions ouvertes</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminé</option>
        </select>
      </div>
    </div>

    <!-- Liste des tournois -->
    <div class="tournaments-list">
      <div
        v-for="tournament in filteredTournaments"
        :key="tournament.id"
        class="tournament-card">
        <div class="tournament-header">
          <h3 class="tournament-name">{{ tournament.name }}</h3>
          <span class="status-badge" :class="tournament.status">
            {{ formatStatus(tournament.status) }}
          </span>
        </div>

        <div class="tournament-info">
          <div class="info-row">
            <div class="info-label">Date</div>
            <div class="info-value">{{ formatDate(tournament.date) }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Créé par</div>
            <div class="info-value">
              {{
                tournament.createdBy ? tournament.createdBy.username : "Admin"
              }}
            </div>
          </div>
        </div>

        <div class="tournament-description">
          <p>{{ tournament.description || "Aucune description" }}</p>
        </div>

        <div class="tournament-actions">
          <button class="action-btn edit" @click="editTournament(tournament)">
            Modifier
          </button>
          <router-link
            :to="`/admin/tournaments/${tournament.id}`"
            class="action-btn view">
            Détails
          </router-link>
          <button
            class="action-btn delete"
            @click="confirmDeleteTournament(tournament)"
            :disabled="tournament.status === 'in_progress'">
            Supprimer
          </button>
        </div>
      </div>

      <!-- Message si aucun tournoi trouvé -->
      <div v-if="filteredTournaments.length === 0" class="no-data">
        <p>Aucun tournoi ne correspond à vos critères</p>
        <button class="create-btn" @click="showCreateModal = true">
          Créer un tournoi
        </button>
      </div>
    </div>

    <!-- Modal de création/édition de tournoi -->
    <div
      v-if="showCreateModal || isEditing"
      class="modal-overlay"
      @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            {{ isEditing ? "Modifier le tournoi" : "Créer un nouveau tournoi" }}
          </h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <form @submit.prevent="saveTournament" class="tournament-form">
          <div class="form-group">
            <label for="name">Nom du tournoi *</label>
            <input
              type="text"
              id="name"
              v-model="tournamentForm.name"
              required
              :class="{ error: errors.name }" />
            <span v-if="errors.name" class="error-message">{{
              errors.name
            }}</span>
          </div>

          <div class="form-group">
            <label for="date">Date du tournoi *</label>
            <input
              type="datetime-local"
              id="date"
              v-model="tournamentForm.date"
              required
              :class="{ error: errors.date }" />
            <span v-if="errors.date" class="error-message">{{
              errors.date
            }}</span>
          </div>

          <div class="form-group">
            <label for="status">Statut *</label>
            <select
              id="status"
              v-model="tournamentForm.status"
              required
              :class="{ error: errors.status }">
              <option value="draft">Brouillon</option>
              <option value="open">Inscriptions ouvertes</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
            </select>
            <span v-if="errors.status" class="error-message">{{
              errors.status
            }}</span>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="tournamentForm.description"
              rows="4"
              :class="{ error: errors.description }"></textarea>
            <span v-if="errors.description" class="error-message">{{
              errors.description
            }}</span>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeModal">
              Annuler
            </button>
            <button type="submit" class="submit-btn">
              {{ isEditing ? "Enregistrer" : "Créer" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmation pour la suppression -->
    <div
      v-if="showDeleteConfirmation"
      class="modal-overlay"
      @click.self="cancelDelete">
      <div class="modal-content delete-confirmation">
        <div class="modal-header">
          <h3>Confirmer la suppression</h3>
          <button class="close-btn" @click="cancelDelete">&times;</button>
        </div>
        <div class="confirmation-content">
          <p>
            Êtes-vous sûr de vouloir supprimer le tournoi
            <strong>{{ tournamentToDelete.name }}</strong> ?
          </p>
          <div class="confirmation-actions">
            <button class="cancel-btn" @click="cancelDelete">Annuler</button>
            <button class="delete-btn" @click="deleteTournament">
              Supprimer définitivement
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tournamentStore from "../../store/tournamentStore";

export default {
  name: "Tournaments",
  data() {
    return {
      tournaments: [],
      searchQuery: "",
      statusFilter: "",
      showCreateModal: false,
      isEditing: false,
      tournamentForm: {
        name: "",
        date: "",
        description: "",
        status: "open",
      },
      errors: {
        name: "",
        date: "",
        description: "",
        status: "",
      },
      showDeleteConfirmation: false,
      tournamentToDelete: null,
      loading: false,
    };
  },
  computed: {
    filteredTournaments() {
      let result = [...this.tournaments];

      // Filtrer par recherche
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(
          (tournament) =>
            tournament.name.toLowerCase().includes(query) ||
            (tournament.description &&
              tournament.description.toLowerCase().includes(query))
        );
      }

      // Filtrer par statut
      if (this.statusFilter) {
        result = result.filter(
          (tournament) => tournament.status === this.statusFilter
        );
      }

      return result;
    },
  },
  methods: {
    async loadTournaments() {
      this.loading = true;
      try {
        const tournamentData = await tournamentStore.fetchAllTournaments();
        this.tournaments = tournamentData;
      } catch (error) {
        console.error("Erreur lors du chargement des tournois:", error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    formatStatus(status) {
      const statusMap = {
        draft: "Brouillon",
        open: "Inscriptions ouvertes",
        in_progress: "En cours",
        completed: "Terminé",
      };
      return statusMap[status] || status;
    },
    editTournament(tournament) {
      this.isEditing = true;
      this.tournamentForm = {
        id: tournament.id,
        name: tournament.name,
        date: this.formatDateForInput(new Date(tournament.date)),
        description: tournament.description || "",
        status: tournament.status,
      };
      this.showCreateModal = true;
      this.resetErrors();
    },
    resetErrors() {
      this.errors = {
        name: "",
        date: "",
        description: "",
        status: "",
      };
    },
    validateForm() {
      let isValid = true;
      this.resetErrors();

      // Valider le nom
      if (!this.tournamentForm.name.trim()) {
        this.errors.name = "Le nom du tournoi est requis";
        isValid = false;
      } else if (this.tournamentForm.name.length < 3) {
        this.errors.name = "Le nom doit contenir au moins 3 caractères";
        isValid = false;
      }

      // Valider la date
      if (!this.tournamentForm.date) {
        this.errors.date = "La date du tournoi est requise";
        isValid = false;
      }

      return isValid;
    },
    async saveTournament() {
      if (!this.validateForm()) {
        return;
      }

      try {
        if (this.isEditing) {
          await tournamentStore.updateTournament(this.tournamentForm);
        } else {
          await tournamentStore.createTournament(this.tournamentForm);
        }
        await this.loadTournaments();
        this.closeModal();
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du tournoi:", error);
      }
    },
    formatDateForInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    closeModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.tournamentForm = {
        name: "",
        date: "",
        description: "",
        status: "draft",
      };
    },
    confirmDeleteTournament(tournament) {
      this.tournamentToDelete = tournament;
      this.showDeleteConfirmation = true;
    },
    cancelDelete() {
      this.tournamentToDelete = null;
      this.showDeleteConfirmation = false;
    },
    async deleteTournament() {
      try {
        await tournamentStore.deleteTournament(this.tournamentToDelete.id);
        await this.loadTournaments();
        this.cancelDelete();
      } catch (error) {
        console.error("Erreur lors de la suppression du tournoi:", error);
      }
    },
  },
  mounted() {
    this.loadTournaments();
  },
};
</script>

<style scoped>
.tournaments-page {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.header-title h2 {
  color: #fff;
  font-size: 1.8rem;
  margin: 0 0 5px 0;
}

.subtitle {
  color: #aaa;
  margin: 0;
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ef854d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.create-btn:hover {
  background-color: #d67642;
  transform: translateY(-2px);
}

.create-btn .icon {
  font-size: 1.2rem;
  line-height: 1;
}

/* Filtres */
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: #1e1e1e;
  padding: 15px;
  border-radius: 8px;
}

.search {
  flex: 1;
  width: 100%;
}

.search input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #333;
  background-color: #121212;
  color: white;
  border-radius: 5px;
  outline: none;
}

.search input:focus {
  border-color: #ef854d;
}

.filter-group {
  display: flex;
  gap: 10px;
  margin-left: 15px;
}

.filter-group select {
  padding: 10px 15px;
  border: 1px solid #333;
  background-color: #121212;
  color: white;
  border-radius: 5px;
  outline: none;
}

.filter-group select:focus {
  border-color: #ef854d;
}

/* Liste des tournois */
.tournaments-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.tournament-card {
  background-color: #1e1e1e;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tournament-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.tournament-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #2a2a2a;
  border-bottom: 1px solid #333;
}

.tournament-name {
  margin: 0;
  color: #ef854d;
  font-size: 1.2rem;
  font-weight: bold;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status-badge.draft {
  background-color: rgba(158, 158, 158, 0.2);
  color: #9e9e9e;
}

.status-badge.open {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.status-badge.in_progress {
  background-color: rgba(239, 133, 77, 0.2);
  color: #ef854d;
}

.status-badge.completed {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.tournament-info {
  padding: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.info-row {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.8rem;
  color: #aaa;
  margin-bottom: 5px;
}

.info-value {
  color: white;
  font-weight: bold;
}

.tournament-description {
  padding: 0 15px;
  flex: 1;
}

.tournament-description p {
  color: #ddd;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; /* Limite à 2 lignes */
  text-overflow: ellipsis;
}

.tournament-actions {
  display: flex;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid #333;
  flex-wrap: wrap;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 90px;
  max-width: 150px;
}

.action-btn.edit {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.action-btn.edit:hover {
  background-color: rgba(33, 150, 243, 0.5);
}

.action-btn.view {
  background-color: rgba(158, 158, 158, 0.2);
  color: #9e9e9e;
}

.action-btn.view:hover {
  background-color: rgba(158, 158, 158, 0.5);
}

.action-btn.delete {
  background-color: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.action-btn.delete:hover {
  background-color: rgba(244, 67, 54, 0.5);
}

.action-btn:disabled {
  background-color: rgba(158, 158, 158, 0.1);
  color: #666;
  cursor: not-allowed;
}

.no-data {
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px;
  color: #aaa;
  background-color: #1e1e1e;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.no-data p {
  margin: 0;
  font-size: 1.1rem;
}

/* Modal */
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
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #333;
}

.modal-header h3 {
  margin: 0;
  color: #ef854d;
}

.close-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Formulaire */
.tournament-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: white;
  font-weight: bold;
}

input,
select,
textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 12px;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #ef854d;
}

input.error,
select.error,
textarea.error {
  border-color: #f44336;
}

.error-message {
  display: block;
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

.cancel-btn {
  background-color: #444;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background-color: #555;
}

.submit-btn {
  background-color: #ef854d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover {
  background-color: #d67642;
}

.submit-btn:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

/* Confirmation de suppression */
.delete-confirmation .confirmation-content {
  padding: 20px;
}

.confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

/* Responsive */
@media (max-width: 768px) {
  .tournaments-list {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .page-header > * {
    text-align: center;
  }

  .header-title h2 {
    font-size: 1.4em;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    margin: 0 auto;
  }

  .filters {
    flex-direction: column;
    gap: 15px;
    margin: 0;
    align-items: start;
  }

  .filter-group {
    width: 100%;
    margin-left: 0;
  }
}
</style>
