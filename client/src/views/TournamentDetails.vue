<template>
  <div class="tournament-details">
    <div class="details-header" v-if="tournament">
      <div class="header-content">
        <div class="header-top">
          <h1>{{ tournament.name }}</h1>
          <span class="status-badge" :class="tournament.status">
            {{ formatStatus(tournament.status) }}
          </span>
        </div>
        <div class="tournament-meta">
          <div class="meta-item">
            <span class="meta-label">Date:</span>
            <span class="meta-value">{{ formatDate(tournament.date) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Équipes:</span>
            <span class="meta-value">{{
              tournament.Teams ? tournament.Teams.length : 0
            }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Statut:</span>
            <span class="meta-value">{{
              formatStatus(tournament.status)
            }}</span>
          </div>
        </div>

        <p class="tournament-description">
          {{ tournament.description || "Aucune description disponible." }}
        </p>

        <div class="header-actions">
          <button
            v-if="tournament.status === 'open'"
            class="action-btn add"
            @click="showAddTeamModal = true">
            <span class="icon">+</span> Ajouter une équipe
          </button>
          <button
            v-if="
              tournament.status === 'open' &&
              tournament.Teams &&
              tournament.Teams.length >= 2
            "
            class="action-btn generate"
            @click="showGenerateMatchesConfirm = true">
            Générer les matchs
          </button>
        </div>
      </div>
    </div>

    <!-- Onglets de navigation -->
    <div class="tabs-navigation">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'teams' }"
        @click="activeTab = 'teams'">
        Équipes inscrites
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'matches' }"
        @click="activeTab = 'matches'">
        Matchs
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'standings' }"
        @click="activeTab = 'standings'">
        Classement
      </button>
    </div>

    <!-- Contenu de l'onglet équipes -->
    <div v-if="activeTab === 'teams'" class="tab-content">
      <div v-if="loading" class="loading">Chargement des équipes...</div>
      <div
        v-else-if="
          !tournament || !tournament.Teams || tournament.Teams.length === 0
        "
        class="empty-state">
        <p>Aucune équipe inscrite à ce tournoi.</p>
        <button
          v-if="tournament && tournament.status === 'open'"
          class="action-btn"
          @click="showAddTeamModal = true">
          Ajouter une équipe
        </button>
      </div>
      <div v-else class="teams-grid">
        <div v-for="team in tournament.Teams" :key="team.id" class="team-card">
          <h3 class="team-name">{{ team.name }}</h3>
          <div class="team-details">
            <div class="player">
              <span class="player-label">Joueur 1:</span>
              <span class="player-name">{{ team.player1Name }}</span>
            </div>
            <div class="player">
              <span class="player-label">Joueur 2:</span>
              <span class="player-name">{{ team.player2Name }}</span>
            </div>
          </div>
          <div v-if="tournament.status === 'open'" class="team-actions">
            <button class="remove-btn" @click="confirmRemoveTeam(team)">
              Retirer du tournoi
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu de l'onglet matchs -->
    <div v-if="activeTab === 'matches'" class="tab-content">
      <div v-if="loading" class="loading">Chargement des matchs...</div>
      <div v-else-if="!matches || matches.length === 0" class="empty-state">
        <p>Aucun match n'a encore été généré pour ce tournoi.</p>
        <button
          v-if="
            tournament &&
            tournament.status === 'open' &&
            tournament.Teams &&
            tournament.Teams.length >= 2
          "
          class="action-btn generate"
          @click="showGenerateMatchesConfirm = true">
          Générer les matchs
        </button>
      </div>
      <div v-else class="matches-list">
        <div v-for="match in matches" :key="match.id" class="match-card">
          <div class="match-status" :class="match.status">
            {{ formatMatchStatus(match.status) }}
          </div>

          <!-- Date du match -->
          <div class="match-date">
            <span class="date-icon">📅</span>
            <span class="date-text">{{ formatDate(match.scheduledDate) }}</span>
          </div>

          <div class="match-teams">
            <div class="team home-team">
              <span class="team-name">{{ getTeamName(match.homeTeamId) }}</span>
              <span v-if="match.status === 'completed'" class="score">{{
                match.homeScore
              }}</span>
            </div>
            <div class="vs">VS</div>
            <div class="team away-team">
              <span v-if="match.status === 'completed'" class="score">{{
                match.awayScore
              }}</span>
              <span class="team-name">{{ getTeamName(match.awayTeamId) }}</span>
            </div>
          </div>
          <div
            class="match-actions"
            v-if="
              match.status !== 'completed' &&
              tournament.status === 'in_progress'
            ">
            <button class="action-btn" @click="showEnterResultModal(match)">
              Saisir le résultat
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu de l'onglet classement -->
    <div v-if="activeTab === 'standings'" class="tab-content">
      <div v-if="loading" class="loading">Chargement du classement...</div>
      <div
        v-else-if="!tournamentTeams || tournamentTeams.length === 0"
        class="empty-state">
        <p>Aucune donnée de classement disponible.</p>
      </div>
      <div v-else class="standings-table">
        <table>
          <thead>
            <tr>
              <th>Pos.</th>
              <th class="team-col">Équipe</th>
              <th>J</th>
              <th>G</th>
              <th>N</th>
              <th>P</th>
              <th>BP</th>
              <th>BC</th>
              <th>Diff</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(teamStats, index) in sortedStandings"
              :key="teamStats.id">
              <td class="position">{{ index + 1 }}</td>
              <td class="team-col">{{ getTeamName(teamStats.teamId) }}</td>
              <td>{{ teamStats.matchesPlayed }}</td>
              <td>{{ teamStats.matchesWon }}</td>
              <td>{{ teamStats.matchesDraw }}</td>
              <td>{{ teamStats.matchesLost }}</td>
              <td>{{ teamStats.goalsFor }}</td>
              <td>{{ teamStats.goalsAgainst }}</td>
              <td
                :class="{
                  positive: teamStats.goalsFor - teamStats.goalsAgainst > 0,
                  negative: teamStats.goalsFor - teamStats.goalsAgainst < 0,
                }">
                {{ teamStats.goalsFor - teamStats.goalsAgainst }}
              </td>
              <td class="points">{{ teamStats.points }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal pour ajouter une équipe au tournoi -->
    <div
      v-if="showAddTeamModal"
      class="modal-overlay"
      @click.self="showAddTeamModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Ajouter une équipe au tournoi</h3>
          <button class="close-btn" @click="showAddTeamModal = false">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <div v-if="loadingAvailableTeams" class="loading">
            Chargement des équipes disponibles...
          </div>
          <div
            v-else-if="!availableTeams || availableTeams.length === 0"
            class="empty-state">
            <p>Aucune équipe disponible à ajouter.</p>
          </div>
          <div v-else>
            <div class="form-group">
              <label for="teamSelect">Sélectionner une équipe</label>
              <select v-model="selectedTeamId" class="team-select">
                <option value="" disabled selected>Choisir une équipe</option>
                <option
                  v-for="team in availableTeams"
                  :key="team.id"
                  :value="team.id">
                  {{ team.name }} ({{ team.player1Name }} &
                  {{ team.player2Name }})
                </option>
              </select>
            </div>
            <div class="form-actions">
              <button class="cancel-btn" @click="showAddTeamModal = false">
                Annuler
              </button>
              <button
                class="submit-btn"
                @click="addTeamToTournament"
                :disabled="!selectedTeamId">
                Ajouter l'équipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour confirmer la génération des matchs -->
    <div
      v-if="showGenerateMatchesConfirm"
      class="modal-overlay"
      @click.self="showGenerateMatchesConfirm = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Générer les matchs</h3>
          <button class="close-btn" @click="showGenerateMatchesConfirm = false">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <p>
            Vous êtes sur le point de générer les matchs pour le tournoi
            "<strong>{{ tournament?.name }}</strong
            >".
          </p>
          <p>Ce processus va :</p>
          <ul>
            <li>Créer un match entre chaque paire d'équipes</li>
            <li>Changer le statut du tournoi à "En cours"</li>
          </ul>
          <p class="warning">
            Attention : Cette action ne peut pas être annulée.
          </p>
          <div class="form-actions">
            <button
              class="cancel-btn"
              @click="showGenerateMatchesConfirm = false">
              Annuler
            </button>
            <button class="submit-btn" @click="generateMatches">
              Générer les matchs
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour saisir le résultat d'un match -->
    <div
      v-if="showResultModal"
      class="modal-overlay"
      @click.self="showResultModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Saisir le résultat du match</h3>
          <button class="close-btn" @click="showResultModal = false">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <div class="match-teams-result">
            <div class="team home-team">
              <span class="team-name">{{
                getTeamName(currentMatch?.homeTeamId)
              }}</span>
              <input
                type="number"
                v-model="matchResult.homeScore"
                min="0"
                class="score-input"
                placeholder="Score" />
            </div>
            <div class="vs">VS</div>
            <div class="team away-team">
              <input
                type="number"
                v-model="matchResult.awayScore"
                min="0"
                class="score-input"
                placeholder="Score" />
              <span class="team-name">{{
                getTeamName(currentMatch?.awayTeamId)
              }}</span>
            </div>
          </div>
          <div class="form-actions">
            <button class="cancel-btn" @click="showResultModal = false">
              Annuler
            </button>
            <button
              class="submit-btn"
              @click="saveMatchResult"
              :disabled="
                matchResult.homeScore === null || matchResult.awayScore === null
              ">
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour confirmer le retrait d'une équipe -->
    <div
      v-if="showRemoveTeamConfirm"
      class="modal-overlay"
      @click.self="showRemoveTeamConfirm = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Retirer l'équipe</h3>
          <button class="close-btn" @click="showRemoveTeamConfirm = false">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <p>
            Êtes-vous sûr de vouloir retirer l'équipe "<strong>{{
              teamToRemove?.name
            }}</strong
            >" du tournoi ?
          </p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showRemoveTeamConfirm = false">
              Annuler
            </button>
            <button class="delete-btn" @click="removeTeamFromTournament">
              Retirer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tournamentStore from "../store/tournamentStore";
import teamsStore from "../store/teamsStore";

export default {
  name: "TournamentDetails",
  data() {
    return {
      tournamentId: null,
      tournament: null,
      matches: [],
      tournamentTeams: [],
      availableTeams: [],
      activeTab: "teams",
      loading: false,
      loadingAvailableTeams: false,
      showAddTeamModal: false,
      showGenerateMatchesConfirm: false,
      showResultModal: false,
      showRemoveTeamConfirm: false,
      selectedTeamId: "",
      currentMatch: null,
      teamToRemove: null,
      matchResult: {
        homeScore: null,
        awayScore: null,
      },
    };
  },
  computed: {
    sortedStandings() {
      if (!this.tournamentTeams) return [];

      return [...this.tournamentTeams].sort((a, b) => {
        // Trier par points (décroissant)
        if (b.points !== a.points) return b.points - a.points;

        // Puis par différence de buts
        const diffA = a.goalsFor - a.goalsAgainst;
        const diffB = b.goalsFor - b.goalsAgainst;
        if (diffB !== diffA) return diffB - diffA;

        // Puis par buts marqués
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

        // Puis par nom d'équipe
        const teamNameA = this.getTeamName(a.teamId);
        const teamNameB = this.getTeamName(b.teamId);
        return teamNameA.localeCompare(teamNameB);
      });
    },
  },
  methods: {
    async loadTournamentData() {
      this.loading = true;
      try {
        // Charger les détails du tournoi avec ses équipes
        const tournamentData = await tournamentStore.fetchTournamentById(
          this.tournamentId
        );
        this.tournament = tournamentData;

        // Charger les matchs du tournoi
        await this.loadMatches();

        // Charger le classement du tournoi
        await this.loadStandings();
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données du tournoi:",
          error
        );
      } finally {
        this.loading = false;
      }
    },

    async loadMatches() {
      try {
        const matchesData = await tournamentStore.fetchTournamentMatches(
          this.tournamentId
        );
        this.matches = matchesData;
      } catch (error) {
        console.error("Erreur lors du chargement des matchs:", error);
      }
    },

    async loadStandings() {
      try {
        const standingsData = await tournamentStore.fetchTournamentStandings(
          this.tournamentId
        );
        this.tournamentTeams = standingsData;
      } catch (error) {
        console.error("Erreur lors du chargement du classement:", error);
      }
    },

    async loadAvailableTeams() {
      this.loadingAvailableTeams = true;
      try {
        // Charger toutes les équipes
        const allTeams = await teamsStore.fetchAllTeams();

        // Filtrer pour exclure les équipes déjà inscrites
        const tournamentTeamIds = this.tournament.Teams.map((team) => team.id);
        this.availableTeams = allTeams.filter(
          (team) => !tournamentTeamIds.includes(team.id)
        );
      } catch (error) {
        console.error(
          "Erreur lors du chargement des équipes disponibles:",
          error
        );
      } finally {
        this.loadingAvailableTeams = false;
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

    formatMatchStatus(status) {
      const statusMap = {
        scheduled: "À jouer",
        in_progress: "En cours",
        completed: "Terminé",
      };
      return statusMap[status] || status;
    },

    getTeamName(teamId) {
      if (!this.tournament || !this.tournament.Teams) return "Équipe inconnue";

      const team = this.tournament.Teams.find((t) => t.id === teamId);
      return team ? team.name : "Équipe inconnue";
    },

    goBack() {
      this.$router.push("/admin/tournaments");
    },

    async addTeamToTournament() {
      if (!this.selectedTeamId) return;

      try {
        await tournamentStore.registerTeamToTournament(
          this.tournamentId,
          this.selectedTeamId
        );
        await this.loadTournamentData();
        this.showAddTeamModal = false;
        this.selectedTeamId = "";
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'équipe au tournoi:", error);
      }
    },

    async generateMatches() {
      try {
        await tournamentStore.generateMatches(this.tournamentId);
        await this.loadTournamentData();
        this.showGenerateMatchesConfirm = false;
        // Basculer vers l'onglet matches après la génération
        this.activeTab = "matches";
      } catch (error) {
        console.error("Erreur lors de la génération des matchs:", error);
      }
    },

    showEnterResultModal(match) {
      this.currentMatch = match;
      this.matchResult = {
        homeScore: null,
        awayScore: null,
      };
      this.showResultModal = true;
    },

    async saveMatchResult() {
      if (!this.currentMatch) return;

      try {
        await tournamentStore.updateMatchResult(
          this.currentMatch.id,
          this.matchResult.homeScore,
          this.matchResult.awayScore
        );
        await this.loadMatches();
        await this.loadStandings();
        this.showResultModal = false;
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du résultat:", error);
      }
    },

    confirmRemoveTeam(team) {
      this.teamToRemove = team;
      this.showRemoveTeamConfirm = true;
    },

    async removeTeamFromTournament() {
      if (!this.teamToRemove) return;

      try {
        await tournamentStore.removeTeamFromTournament(
          this.tournamentId,
          this.teamToRemove.id
        );
        await this.loadTournamentData();
        this.showRemoveTeamConfirm = false;
        this.teamToRemove = null;
      } catch (error) {
        console.error("Erreur lors du retrait de l'équipe:", error);
      }
    },
  },
  mounted() {
    this.tournamentId = parseInt(this.$route.params.id);
    if (isNaN(this.tournamentId)) {
      // Rediriger vers la liste des tournois si l'ID n'est pas valide
      this.$router.push("/admin/tournaments");
      return;
    }

    this.loadTournamentData();
  },
  watch: {
    showAddTeamModal(newVal) {
      if (newVal) {
        this.loadAvailableTeams();
      }
    },
  },
};
</script>

<style scoped>
.tournament-details {
  padding: 20px;
}

.details-header {
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

h1 {
  color: #ef854d;
  margin: 0;
  font-size: 1.8rem;
}

.tournament-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-label {
  color: #aaa;
  font-size: 0.9rem;
}

.meta-value {
  color: white;
  font-weight: bold;
}

.tournament-description {
  color: #ddd;
  line-height: 1.5;
  margin-bottom: 20px;
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

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
}

.action-btn .icon {
  font-size: 1.1rem;
}

.action-btn.add {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.action-btn.add:hover {
  background-color: rgba(33, 150, 243, 0.4);
}

.action-btn.generate {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.action-btn.generate:hover {
  background-color: rgba(76, 175, 80, 0.4);
}

/* Tabs */
.tabs-navigation {
  display: flex;
  border-bottom: 1px solid #333;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  background: none;
  color: #aaa;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;
}

.tab-btn:hover {
  color: white;
}

.tab-btn.active {
  color: #ef854d;
  font-weight: bold;
}

.tab-btn.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #ef854d;
}

.tab-content {
  min-height: 300px;
}

/* Équipes */
.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.team-card {
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.team-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.team-name {
  color: #ef854d;
  margin: 0 0 10px 0;
  font-size: 1.2rem;
}

.team-details {
  margin-bottom: 15px;
}

.player {
  margin-bottom: 8px;
}

.player-label {
  color: #aaa;
  font-size: 0.9rem;
  display: inline-block;
  width: 80px;
}

.player-name {
  color: white;
}

.team-actions {
  display: flex;
  justify-content: flex-end;
}

.remove-btn {
  background-color: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: rgba(244, 67, 54, 0.4);
}

/* Matchs */
.matches-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.match-card {
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.match-status {
  font-size: 0.8rem;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
}

.match-status.scheduled {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.match-status.in_progress {
  background-color: rgba(239, 133, 77, 0.2);
  color: #ef854d;
}

.match-status.completed {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.match-teams {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vs {
  color: #aaa;
  font-weight: bold;
  margin: 0 15px;
}

.team {
  flex: 1;
  display: flex;
  align-items: center;
}

.home-team {
  justify-content: flex-end;
}

.away-team {
  justify-content: flex-start;
}

.team-name {
  font-weight: bold;
  color: white;
}

.score {
  background-color: #2a2a2a;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0 10px;
  font-weight: bold;
  min-width: 25px;
  text-align: center;
}

.match-actions {
  display: flex;
  justify-content: flex-end;
}

/* Classement */
.standings-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  color: white;
}

th,
td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #333;
}

th {
  font-weight: bold;
  color: #aaa;
  font-size: 0.9rem;
}

.team-col {
  text-align: left;
  min-width: 150px;
}

.position {
  font-weight: bold;
  color: #ef854d;
}

.points {
  font-weight: bold;
  color: #ef854d;
}

.positive {
  color: #4caf50;
}

.negative {
  color: #f44336;
}

/* États vides */
.loading,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  text-align: center;
  gap: 15px;
}

.loading {
  color: #aaa;
}

.empty-state {
  color: #999;
}

/* Modals */
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
  max-width: 500px;
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

.modal-body {
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

select,
input,
textarea {
  width: 100%;
  padding: 10px 12px;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
}

select:focus,
input:focus,
textarea:focus {
  outline: none;
  border-color: #ef854d;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
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

.warning {
  background-color: rgba(255, 193, 7, 0.1);
  border-left: 3px solid #ffc107;
  padding: 15px;
  margin: 15px 0;
  color: #eee;
}

/* Saisie de résultat */
.match-teams-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.score-input {
  width: 60px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .teams-grid {
    grid-template-columns: 1fr;
  }

  .header-top,
  .tournament-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .tabs-navigation {
    flex-wrap: wrap;
  }

  .tab-btn {
    flex: 1;
    text-align: center;
  }

  .match-teams {
    flex-direction: column;
    gap: 10px;
  }

  .home-team,
  .away-team {
    justify-content: center;
  }

  .vs {
    margin: 5px 0;
  }

  .match-teams-result {
    flex-direction: column;
    gap: 15px;
  }
}
.match-date {
  display: flex;
  align-items: center;
  margin: 5px 0 10px 0;
  color: #aaa;
  font-size: 0.9rem;
}

.date-icon {
  margin-right: 5px;
}

.date-text {
  color: #ccc;
}
</style>
