<template>
  <div class="admin-layout" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <AdminSidebar @toggle-sidebar="handleSidebarToggle" />

    <div class="admin-content">
      <header class="admin-header">
        <div class="page-title">
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="header-actions">
          <div class="search-bar">
            <input type="text" placeholder="Rechercher..." />
            <button class="search-btn">🔍</button>
          </div>
          <div class="notifications">
            <button class="notification-btn">🔔</button>
            <div v-if="hasNotifications" class="notification-indicator"></div>
          </div>
        </div>
      </header>

      <main class="admin-main">
        <router-view></router-view>
      </main>

      <footer class="admin-footer">
        <p>&copy; 2025 - Application de tournois de Baby-Foot</p>
      </footer>
    </div>
  </div>
</template>

<script>
import AdminSidebar from "../components/AdminSidebar.vue";

export default {
  name: "AdminLayout",
  components: {
    AdminSidebar,
  },
  data() {
    return {
      sidebarCollapsed: false,
      hasNotifications: true,
    };
  },
  computed: {
    pageTitle() {
      // Mapping des titres de pages basé sur la route actuelle
      const routeTitles = {
        "/admin/dashboard": "Tableau de bord",
        "/admin/tournaments": "Gestion des tournois",
        "/admin/teams": "Gestion des équipes",
        "/admin/matches": "Gestion des matchs",
        "/admin/results": "Résultats et classements",
        "/admin/settings": "Paramètres",
      };

      // Retourne le titre correspondant à la route actuelle ou un titre par défaut
      return routeTitles[this.$route.path] || "Administration";
    },
  },
  methods: {
    handleSidebarToggle(isCollapsed) {
      this.sidebarCollapsed = isCollapsed;
    },
  },
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #1a1a1a;
}

.admin-content {
  flex: 1;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar-collapsed .admin-content {
  margin-left: 70px;
}

.admin-header {
  background-color: #121212;
  padding: 15px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: -40px;
}

.page-title h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #fff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #1e1e1e;
  border-radius: 5px;
  padding: 5px 10px;
  width: 250px;
}

.search-bar input {
  background: transparent;
  border: none;
  color: white;
  flex: 1;
  padding: 8px;
  outline: none;
}

.search-bar input::placeholder {
  color: #aaa;
}

.search-btn {
  background: transparent;
  border: none;
  color: #aaa;
  cursor: pointer;
}

.notifications {
  position: relative;
}

.notification-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
}

.notification-indicator {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ef854d;
}

.admin-main {
  flex: 1;
  padding: 25px;
  background-color: #1a1a1a;
  color: white;
  overflow-y: auto;
}

.admin-footer {
  background-color: #121212;
  padding: 15px 25px;
  text-align: center;
  color: #aaa;
  font-size: 0.8rem;
}

/* Styles pour les écrans plus petits */
@media (max-width: 768px) {
  .admin-content {
    margin-left: 0;
  }

  .sidebar-collapsed .admin-content {
    margin-left: 70px;
  }

  .search-bar {
    display: none;
  }
}
</style>
