<template>
  <div class="results-page">
    <div class="page-header">
      <div class="header-title">
        <h2>🏆 Résultats et classements</h2>
        <p class="subtitle">
          Consultez les résultats des matchs et les classements des tournois
        </p>
      </div>
      <div class="header-actions">
        <div class="tournament-filter">
          <select
            id="tournamentFilter"
            v-model="selectedTournament"
            @change="loadTournamentData">
            <option value="">Tous les tournois</option>
            <option
              v-for="tournament in tournaments"
              :key="tournament.id"
              :value="tournament.id">
              {{ tournament.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Indicateur de chargement -->
    <div v-if="isLoading" class="loading-indicator">
      <div class="spinner"></div>
      <p>Chargement des données...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="getAllMatches" class="retry-button">Réessayer</button>
    </div>

    <div v-else>
      <!-- Onglets pour naviguer entre résultats et classement -->
      <div class="tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'results' }"
          @click="activeTab = 'results'">
          Résultats des matchs
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'standings' }"
          @click="activeTab = 'standings'">
          Classements
        </button>
      </div>

      <!-- Contenu des onglets -->
      <div class="tab-content">
        <!-- Onglet des résultats -->
        <div v-if="activeTab === 'results'" class="results-tab">
          <!-- Filtre et recherche -->
          <div class="filters">
            <div class="search">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Rechercher une équipe..."
                @input="filterMatches" />
            </div>
            <div class="filter-group">
              <select v-model="statusFilter" @change="filterMatches">
                <option value="">Tous les statuts</option>
                <option value="completed">Terminés</option>
                <option value="scheduled">À venir</option>
                <option value="in_progress">En cours</option>
              </select>
            </div>
          </div>

          <!-- Tableau des matchs - Vue classique / tablette et desktop -->
          <div class="matches-table-container">
            <table class="matches-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Tournoi</th>
                  <th class="team-col">Équipe domicile</th>
                  <th>Score</th>
                  <th class="team-col">Équipe extérieur</th>
                  <th>Statut</th>
                  <th v-if="isUserAuthenticated">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="match in filteredMatches"
                  :key="match.id"
                  :class="{ editable: match.status !== 'completed' }">
                  <td>
                    {{ formatDate(match.playedDate || match.scheduledDate) }}
                  </td>
                  <td>
                    {{
                      match.tournament || getTournamentName(match.tournamentId)
                    }}
                  </td>
                  <td class="team-col">
                    <div class="team-info">
                      <div>{{ getTeamName(match.homeTeamId) }}</div>
                      <div class="team-players">
                        {{
                          formatTeamPlayers(getTeamPlayers(match.homeTeamId))
                        }}
                      </div>
                    </div>
                  </td>
                  <td class="score-col">
                    <div v-if="match.status === 'completed'" class="score">
                      <span
                        :class="{ winner: match.homeScore > match.awayScore }"
                        >{{ match.homeScore }}</span
                      >
                      <span>-</span>
                      <span
                        :class="{ winner: match.awayScore > match.homeScore }"
                        >{{ match.awayScore }}</span
                      >
                    </div>
                    <div
                      v-else
                      class="score-entry"
                      :class="{
                        active: isEditing && editingMatchId === match.id,
                      }">
                      <template v-if="isEditing && editingMatchId === match.id">
                        <input
                          type="number"
                          v-model="editScore.homeScore"
                          min="0"
                          class="score-input" />
                        <span>-</span>
                        <input
                          type="number"
                          v-model="editScore.awayScore"
                          min="0"
                          class="score-input" />
                      </template>
                      <template v-else>
                        <span>vs</span>
                      </template>
                    </div>
                  </td>
                  <td class="team-col">
                    <div class="team-info">
                      <div>{{ getTeamName(match.awayTeamId) }}</div>
                      <div class="team-players">
                        {{
                          formatTeamPlayers(getTeamPlayers(match.awayTeamId))
                        }}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="status-badge" :class="match.status">
                      {{ formatStatus(match.status) }}
                    </span>
                  </td>
                  <td class="actions" v-if="isUserAuthenticated">
                    <div v-if="match.status !== 'completed'">
                      <button
                        v-if="isEditing && editingMatchId === match.id"
                        class="action-btn save"
                        @click="saveScore(match.id)">
                        Enregistrer
                      </button>
                      <button
                        v-else
                        class="action-btn edit"
                        @click="startEditing(match)">
                        Saisir score
                      </button>
                    </div>
                  </td>
                </tr>
                <!-- Message si aucun match -->
                <tr v-if="filteredMatches.length === 0">
                  <td :colspan="isUserAuthenticated ? 7 : 6" class="no-data">
                    Aucun match ne correspond aux critères de recherche
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Vue alternative des matchs pour mobile -->
          <div class="matches-card-view">
            <div v-if="filteredMatches.length === 0" class="no-data">
              Aucun match ne correspond aux critères de recherche
            </div>
            <div
              v-for="match in filteredMatches"
              :key="match.id"
              class="match-card-mobile"
              :class="{ editable: match.status !== 'completed' }">
              <div class="match-header">
                <div class="match-date">
                  {{ formatDate(match.playedDate || match.scheduledDate) }}
                </div>
                <div>
                  <span class="status-badge" :class="match.status">
                    {{ formatStatus(match.status) }}
                  </span>
                </div>
              </div>
              <div class="match-teams">
                <div class="home-team">
                  <div class="team-name">
                    {{ getTeamName(match.homeTeamId) }}
                  </div>
                  <div class="team-players">
                    {{ formatTeamPlayers(getTeamPlayers(match.homeTeamId)) }}
                  </div>
                </div>
                <div class="match-score">
                  <template v-if="match.status === 'completed'">
                    <span
                      :class="{ winner: match.homeScore > match.awayScore }">
                      {{ match.homeScore }}
                    </span>
                    <span>-</span>
                    <span
                      :class="{ winner: match.awayScore > match.homeScore }">
                      {{ match.awayScore }}
                    </span>
                  </template>
                  <template
                    v-else-if="isEditing && editingMatchId === match.id">
                    <input
                      type="number"
                      v-model="editScore.homeScore"
                      min="0"
                      class="score-input" />
                    <span>-</span>
                    <input
                      type="number"
                      v-model="editScore.awayScore"
                      min="0"
                      class="score-input" />
                  </template>
                  <template v-else>
                    <span>vs</span>
                  </template>
                </div>
                <div class="away-team">
                  <div class="team-name">
                    {{ getTeamName(match.awayTeamId) }}
                  </div>
                  <div class="team-players">
                    {{ formatTeamPlayers(getTeamPlayers(match.awayTeamId)) }}
                  </div>
                </div>
              </div>
              <div class="tournament-name-mobile">
                {{ match.tournament || getTournamentName(match.tournamentId) }}
              </div>
              <div
                class="match-actions"
                v-if="isUserAuthenticated && match.status !== 'completed'">
                <button
                  v-if="isEditing && editingMatchId === match.id"
                  class="action-btn save"
                  @click="saveScore(match.id)">
                  Enregistrer
                </button>
                <button
                  v-else
                  class="action-btn edit"
                  @click="startEditing(match)">
                  Saisir score
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet des classements -->
        <div v-if="activeTab === 'standings'" class="standings-tab">
          <!-- Message si aucun tournoi sélectionné -->
          <div v-if="!selectedTournament" class="no-tournament-message">
            <p>Veuillez sélectionner un tournoi pour voir son classement</p>
          </div>

          <!-- Vue classique du tableau de classement -->
          <div v-else class="standings-container">
            <h3 class="tournament-name">{{ getCurrentTournamentName() }}</h3>

            <table class="standings-table">
              <thead>
                <tr>
                  <th>Pos.</th>
                  <th>Équipe</th>
                  <th>J</th>
                  <th>V</th>
                  <th>N</th>
                  <th>D</th>
                  <th>BP</th>
                  <th>BC</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(team, index) in standings"
                  :key="team.id"
                  :class="{ 'top-three': index < 3 }">
                  <td class="position">{{ index + 1 }}</td>
                  <td class="team-name">
                    <div class="team-info">
                      <div>{{ team.Team ? team.Team.name : team.name }}</div>
                      <div class="team-players">
                        {{ formatTeamPlayers(team.players) }}
                      </div>
                    </div>
                  </td>
                  <td>{{ team.matchesPlayed }}</td>
                  <td>{{ team.matchesWon }}</td>
                  <td>{{ team.matchesDraw }}</td>
                  <td>{{ team.matchesLost }}</td>
                  <td>{{ team.goalsFor }}</td>
                  <td>{{ team.goalsAgainst }}</td>
                  <td class="points">{{ team.points }}</td>
                </tr>
                <!-- Message si aucune équipe -->
                <tr v-if="standings.length === 0">
                  <td colspan="10" class="no-data">
                    Aucune équipe inscrite à ce tournoi ou aucun match joué
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Vue compacte du classement pour mobile -->
            <div class="standings-compact">
              <div
                v-for="(team, index) in standings"
                :key="team.id"
                class="standing-item"
                :class="{ 'top-three': index < 3 }">
                <div class="position">{{ index + 1 }}</div>
                <div class="team-info">
                  <div class="team-name">
                    {{ team.Team ? team.Team.name : team.name }}
                  </div>
                  <div class="team-players">
                    {{ formatTeamPlayers(team.players) }}
                  </div>
                  <div class="details">
                    <span title="Matchs joués">{{ team.matchesPlayed }}J</span>
                    <span title="Victoires">{{ team.matchesWon }}V</span>
                    <span title="Nuls">{{ team.matchesDraw }}N</span>
                    <span title="Défaites">{{ team.matchesLost }}D</span>
                    <span
                      :class="{
                        positive: team.goalDifference > 0,
                        negative: team.goalDifference < 0,
                      }"
                      title="Différence de buts">
                      Diff: {{ team.goalDifference > 0 ? "+" : ""
                      }}{{ team.goalDifference }}
                    </span>
                  </div>
                </div>
                <div class="points" title="Points">{{ team.points }}</div>
              </div>

              <!-- Message si aucune équipe -->
              <div v-if="standings.length === 0" class="no-data standing-item">
                Aucune équipe inscrite à ce tournoi ou aucun match joué
              </div>
            </div>

            <!-- Explication des abréviations -->
            <div class="legend">
              <p>
                <strong>J</strong>: Joués, <strong>V</strong>: Victoires,
                <strong>N</strong>: Nuls, <strong>D</strong>: Défaites,
                <strong>BP</strong>: Buts Pour, <strong>BC</strong>: Buts
                Contre, <strong></strong>: Différence, <strong>Pts</strong>:
                Points
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import matchesStore from "../../store/matchesStore";
import teamsStore from "../../store/teamsStore";
import tournamentStore from "../../store/tournamentStore";
import { isTokenPresent } from "../../utils/auth";
import "./Result.css";

export default {
  name: "Results",
  data() {
    return {
      activeTab: "results",
      selectedTournament: "",
      searchQuery: "",
      statusFilter: "",
      isEditing: false,
      editingMatchId: null,
      editScore: {
        homeScore: 0,
        awayScore: 0,
      },
      showMatchModal: false,
      selectedMatch: null,
      isLoading: false,
      error: null,
      isMobileView: false,
      tournaments: [],
      matches: [],
      teams: [],
      standings: [],
    };
  },
  computed: {
    isUserAuthenticated() {
      return isTokenPresent();
    },

    filteredMatches() {
      let result = [...this.matches];

      // Filtrer par tournoi
      if (this.selectedTournament) {
        result = result.filter(
          (match) => match.tournamentId === parseInt(this.selectedTournament)
        );
      }

      // Filtrer par statut
      if (this.statusFilter) {
        result = result.filter((match) => match.status === this.statusFilter);
      }

      // Filtrer par recherche
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter((match) => {
          const homeTeamName = this.getTeamName(match.homeTeamId).toLowerCase();
          const awayTeamName = this.getTeamName(match.awayTeamId).toLowerCase();
          const homeTeamPlayers = this.getTeamPlayers(
            match.homeTeamId
          ).toLowerCase();
          const awayTeamPlayers = this.getTeamPlayers(
            match.awayTeamId
          ).toLowerCase();

          return (
            homeTeamName.includes(query) ||
            awayTeamName.includes(query) ||
            homeTeamPlayers.includes(query) ||
            awayTeamPlayers.includes(query)
          );
        });
      }

      return result;
    },
  },
  methods: {
    // Méthodes d'API
    async getAllMatches() {
      this.isLoading = true;
      this.error = null;

      try {
        // Chargement des tournois
        const tournamentsData = await tournamentStore.fetchAllTournaments();
        this.tournaments = Array.isArray(tournamentsData)
          ? tournamentsData
          : tournamentsData.data || [];
        // Chargement des équipes
        const teams = await teamsStore.fetchAllTeams();
        this.teams = Array.isArray(teams) ? teams : teams.data || [];
        // Chargement des matchs
        const allMatches = await matchesStore.fetchAllMatches();
        const upcomingMatches = await matchesStore.fetchUpcomingMatches();
        const previousMatches = await matchesStore.fetchPrevious();
        // Extraire les données selon le format de l'API
        const extractData = (data) => {
          if (!data) return [];
          return Array.isArray(data) ? data : data.data || [];
        };
        // Fusionner tous les matchs
        this.matches = [
          ...extractData(allMatches),
          ...extractData(upcomingMatches),
          ...extractData(previousMatches),
        ];
        // Éliminer les doublons
        this.matches = this.matches.filter(
          (match, index, self) =>
            index === self.findIndex((m) => m.id === match.id)
        );
        // Transformer les données des matchs
        this.matches = this.matches.map((match) => ({
          ...match,
          // S'assurer que les propriétés essentielles existent
          homeScore: match.homeScore || 0,
          awayScore: match.awayScore || 0,
          status: match.status || "scheduled",
        }));
        // Si un tournoi est sélectionné, charger ses données
        if (this.selectedTournament) {
          await this.loadTournamentData();
        }

        // Vérifier la vue mobile après chargement des données
        this.$nextTick(() => {
          this.checkMobileView();
        });
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        this.error =
          typeof error === "string"
            ? error
            : "Erreur lors du chargement des données";
      } finally {
        this.isLoading = false;
      }
    },
    async loadTournamentData() {
      if (!this.selectedTournament) {
        this.standings = [];
        return;
      }
      this.isLoading = true;
      try {
        // Récupérer les standings depuis l'API
        const standingsData = await tournamentStore.fetchTournamentStandings(
          this.selectedTournament
        );
        if (standingsData && standingsData.length > 0) {
          // Si l'API renvoie des standings, les utiliser
          this.standings = standingsData;
          console.log("Classements récupérés depuis l'API:", this.standings);
        } else {
          // Sinon, calculer les standings localement
          this.calculateStandings();
          console.log("Classements calculés localement:", this.standings);
        }

        // Vérifier la vue mobile après chargement des données
        this.$nextTick(() => {
          this.checkMobileView();
        });
      } catch (error) {
        console.error("Erreur lors du chargement des classements:", error);
        // Si l'API échoue, calculer les standings localement
        this.calculateStandings();
      } finally {
        this.isLoading = false;
      }
    },
    async saveScore(matchId) {
      // Vérifier si l'utilisateur est authentifié
      if (!this.isUserAuthenticated) {
        this.error = "Vous devez être connecté pour sauvegarder les scores";
        return;
      }
      try {
        this.isLoading = true;
        // Mettre à jour le score via l'API de matchesStore
        const updatedMatch = await matchesStore.updateMatchResult(
          matchId,
          parseInt(this.editScore.homeScore),
          parseInt(this.editScore.awayScore)
        );
        // Mettre à jour le match dans tableau local
        const matchIndex = this.matches.findIndex((m) => m.id === matchId);
        if (matchIndex !== -1) {
          this.matches[matchIndex] = {
            ...this.matches[matchIndex],
            homeScore: parseInt(this.editScore.homeScore),
            awayScore: parseInt(this.editScore.awayScore),
            status: "completed",
            playedDate: new Date().toISOString(),
          };
        }
        // Réinitialiser l'état d'édition
        this.isEditing = false;
        this.editingMatchId = null;
        console.log("Score sauvegardé:", updatedMatch);
        // actualiser le classement après la mise à jour du score
        if (this.activeTab === "standings" && this.selectedTournament) {
          await this.loadTournamentData();
        }
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du score:", error);
        this.error =
          typeof error === "string"
            ? error
            : "Erreur lors de la sauvegarde du score";
      } finally {
        this.isLoading = false;
      }
    },
    // Méthodes de formatage et d'affichage
    getTeamName(teamId) {
      if (!teamId) return "Équipe inconnue";
      const team = this.teams.find((t) => t.id === teamId);
      return team ? team.name : `Équipe ${teamId}`;
    },
    getTeamPlayers(teamId) {
      if (!teamId) return "";
      const team = this.teams.find((t) => t.id === teamId);
      if (!team) return "";
      return `${team.player1Name || ""} & ${team.player2Name || ""}`;
    },
    getTournamentName(tournamentId) {
      if (!tournamentId) return "";
      const tournament = this.tournaments.find((t) => t.id === tournamentId);
      return tournament ? tournament.name : `Tournoi ${tournamentId}`;
    },
    calculateStandings() {
      if (!this.selectedTournament) {
        this.standings = [];
        return;
      }
      // Filtrer les matchs du tournoi sélectionné
      const tournamentMatches = this.matches.filter(
        (match) =>
          match.tournamentId === parseInt(this.selectedTournament) &&
          match.status === "completed"
      );
      // Identifier toutes les équipes qui ont participé
      const teamIds = new Set();
      tournamentMatches.forEach((match) => {
        if (match.homeTeamId) teamIds.add(match.homeTeamId);
        if (match.awayTeamId) teamIds.add(match.awayTeamId);
      });
      // Initialiser les statistiques pour chaque équipe
      const teamsStats = {};
      Array.from(teamIds).forEach((teamId) => {
        const team = this.teams.find((t) => t.id === teamId);
        teamsStats[teamId] = {
          id: teamId,
          Team: {
            id: teamId,
            name: team ? team.name : `Équipe ${teamId}`,
          },
          players: this.getTeamPlayers(teamId),
          matchesPlayed: 0,
          matchesWon: 0,
          matchesDraw: 0,
          matchesLost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        };
      });
      // Calculer les statistiques pour chaque équipe
      tournamentMatches.forEach((match) => {
        const homeTeamId = match.homeTeamId;
        const awayTeamId = match.awayTeamId;
        const homeScore = match.homeScore;
        const awayScore = match.awayScore;
        // Vérifier que les équipes existent dans teamsStats
        if (!teamsStats[homeTeamId] || !teamsStats[awayTeamId]) {
          return;
        }
        // Matches joués
        teamsStats[homeTeamId].matchesPlayed++;
        teamsStats[awayTeamId].matchesPlayed++;
        // Buts marqués et encaissés
        teamsStats[homeTeamId].goalsFor += homeScore;
        teamsStats[homeTeamId].goalsAgainst += awayScore;
        teamsStats[awayTeamId].goalsFor += awayScore;
        teamsStats[awayTeamId].goalsAgainst += homeScore;
        // Résultat du match
        if (homeScore > awayScore) {
          // Victoire de l'équipe à domicile
          teamsStats[homeTeamId].matchesWon++;
          teamsStats[homeTeamId].points += 3;
          teamsStats[awayTeamId].matchesLost++;
        } else if (homeScore < awayScore) {
          // Victoire de l'équipe à l'extérieur
          teamsStats[awayTeamId].matchesWon++;
          teamsStats[awayTeamId].points += 3;
          teamsStats[homeTeamId].matchesLost++;
        } else {
          // Match nul
          teamsStats[homeTeamId].matchesDraw++;
          teamsStats[awayTeamId].matchesDraw++;
          teamsStats[homeTeamId].points += 1;
          teamsStats[awayTeamId].points += 1;
        }
      });
      // Calculer la différence de buts
      Object.values(teamsStats).forEach((team) => {
        team.goalDifference = team.goalsFor - team.goalsAgainst;
      });
      // Convertir en tableau et trier
      const sortedStandings = Object.values(teamsStats).sort((a, b) => {
        // D'abord par points
        if (a.points !== b.points) return b.points - a.points;
        // Puis par différence de buts
        if (a.goalDifference !== b.goalDifference)
          return b.goalDifference - a.goalDifference;
        // Puis par buts marqués
        if (a.goalsFor !== b.goalsFor) return b.goalsFor - a.goalsFor;
        // Enfin par ordre alphabétique
        return a.Team.name.localeCompare(b.Team.name);
      });
      this.standings = sortedStandings;
    },
    formatDate(dateString) {
      if (!dateString) return "Non programmé";
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    formatDateTime(dateString) {
      if (!dateString) return "Non programmé";
      const date = new Date(dateString);
      return `${date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })} ${date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    },
    formatStatus(status) {
      const statusMap = {
        completed: "Terminé",
        scheduled: "Programmé",
        in_progress: "En cours",
        cancelled: "Annulé",
      };
      return statusMap[status] || status;
    },
    formatTeamPlayers(players) {
      if (!players) return "";
      // Si les joueurs sont déjà formatés, les retourner tels quels
      if (players.includes("&")) return players;
      // Formater les noms
      const formatName = (fullName) => {
        if (!fullName) return "";
        const parts = fullName.trim().split(" ");
        if (parts.length === 1) return parts[0];
        return `${parts[0]}.${parts[1].charAt(0)}`;
      };
      const playerNames = players
        .split(",")
        .map((name) => formatName(name.trim()));
      return playerNames.join(" & ");
    },
    startEditing(match) {
      this.isEditing = true;
      this.editingMatchId = match.id;
      this.editScore = {
        homeScore: match.homeScore || 0,
        awayScore: match.awayScore || 0,
      };
    },
    viewMatchDetails(matchId) {
      const match = this.matches.find((m) => m.id === matchId);
      if (match) {
        this.selectedMatch = match;
        this.showMatchModal = true;
      }
    },

    closeModal() {
      this.showMatchModal = false;
      this.selectedMatch = null;
    },

    getCurrentTournamentName() {
      if (!this.selectedTournament) return "";
      const tournament = this.tournaments.find(
        (t) => t.id === parseInt(this.selectedTournament)
      );
      return tournament ? tournament.name : "";
    },

    checkMobileView() {
      // Déterminer si nous sommes sur mobile en fonction de la largeur de la fenêtre
      this.isMobileView = window.innerWidth <= 768;

      // Appliquer des classes CSS pour afficher/masquer les vues appropriées
      this.$nextTick(() => {
        const tableContainer = document.querySelector(
          ".matches-table-container"
        );
        const cardView = document.querySelector(".matches-card-view");
        const standingsTable = document.querySelector(".standings-table");
        const standingsCompact = document.querySelector(".standings-compact");

        if (tableContainer && cardView) {
          if (this.isMobileView) {
            tableContainer.style.display = "none";
            cardView.style.display = "block";
          } else {
            tableContainer.style.display = "block";
            cardView.style.display = "none";
          }
        }

        if (standingsTable && standingsCompact) {
          if (this.isMobileView) {
            standingsTable.style.display = "none";
            standingsCompact.style.display = "block";
          } else {
            standingsTable.style.display = "table";
            standingsCompact.style.display = "none";
          }
        }
      });
    },
  },
  mounted() {
    // Charger les données au montage du composant
    this.getAllMatches();

    // Initialiser la détection de la vue mobile
    this.checkMobileView();

    // Ajouter un écouteur pour les changements de taille d'écran
    window.addEventListener("resize", this.checkMobileView);
  },
  beforeUnmount() {
    // Nettoyer l'écouteur lors de la destruction du composant
    window.removeEventListener("resize", this.checkMobileView);
  },
};
</script>
