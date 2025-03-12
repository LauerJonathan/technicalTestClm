<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <div class="logo-container">
        <img src="../assets/logoClem.png" alt="Logo Babyfoot" class="logo" />
      </div>
      <h2 class="sidebar-title">Admin</h2>
      <button class="collapse-btn" @click="toggleSidebar">
        <span v-if="isCollapsed">&#9654;</span>
        <span v-else>&#9664;</span>
      </button>
    </div>

    <div class="user-info">
      <div class="avatar">
        <span>{{ getUserInitials() }}</span>
      </div>
      <div v-if="!isCollapsed" class="user-details">
        <p class="user-name">{{ user.name }}</p>
        <p class="user-role">Administrateur</p>
      </div>
    </div>

    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li
          v-for="item in menuItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: activeItem === item.id }">
          <router-link :to="item.path" @click="setActiveItem(item.id)">
            <span class="nav-icon" v-html="item.icon"></span>
            <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <button class="logout-btn" @click="logout">
        <span class="logout-icon">&#128682;</span>
        <span v-if="!isCollapsed" class="logout-text">Déconnexion</span>
      </button>
    </div>
  </div>
</template>

<script>
import authStore from "../store/auth";
export default {
  name: "AdminSidebar",
  data() {
    return {
      isCollapsed: true,
      activeItem: "Tournois",
      user: {
        name: "Admin Babyfoot",
        email: "admin@babyfoot.com",
      },
      menuItems: [
        {
          id: "Tournois",
          label: "Tournois",
          icon: "&#127942;",
          path: "/admin",
        },
        {
          id: "teams",
          label: "Équipes",
          icon: "&#128101;",
          path: "/admin/teams",
        },
        {
          id: "results",
          label: "Résultats",
          icon: "&#128202;",
          path: "/results",
        },
      ],
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
      // Émettre un événement pour que le layout parent puisse s'ajuster
      this.$emit("toggle-sidebar", this.isCollapsed);
    },
    setActiveItem(itemId) {
      this.activeItem = itemId;
    },
    getUserInitials() {
      const names = this.user.name.split(" ");
      let initials = "";
      names.forEach((name) => {
        if (name.length > 0) {
          initials += name[0].toUpperCase();
        }
      });
      return initials.slice(0, 2); // Limiter à 2 caractères
    },
    logout() {
      authStore.logout();
      this.$router.push("/");

      console.log("Déconnexion réussie");
    },
    clearError() {
      state.error = null;
    },
  },
};
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 250px;
  height: calc(100vh - 62px);
  background-color: #121212;
  color: white;
  border-right: 2px solid #1e1e1e;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 20px 15px;
  border-bottom: 1px solid #2a2a2a;
  position: relative;
}

.logo-container {
  width: 40px;
  height: 40px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 100%;
  height: auto;
}

.sidebar-title {
  margin-left: 15px;
  font-size: 1.2rem;
  color: #ef854d;
  white-space: nowrap;
  overflow: hidden;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.collapsed .sidebar-title {
  opacity: 0;
  width: 0;
  margin-left: 0;
}

.collapse-btn {
  position: absolute;
  right: -12px;
  top: 20px;
  width: 24px;
  height: 24px;
  background: #ef854d;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  z-index: 10;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #2a2a2a;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ef854d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
}

.user-details {
  margin-left: 15px;
  overflow: hidden;
  transition: opacity 0.3s ease;
}

.user-name {
  font-size: 0.9rem;
  font-weight: bold;
  margin: 0;
  white-space: nowrap;
}

.user-role {
  font-size: 0.8rem;
  color: #aaa;
  margin: 0;
  white-space: nowrap;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 15px 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 5px;
  transition: background-color 0.2s ease;
}

.nav-item a {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #ccc;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-item a:hover {
  background-color: rgba(239, 133, 77, 0.1);
  color: #ef854d;
}

.nav-item.active a {
  background-color: rgba(239, 133, 77, 0.2);
  color: #ef854d;
  border-left: 4px solid #ef854d;
}

.nav-icon {
  font-size: 1.2rem;
  min-width: 30px;
  text-align: center;
}

.nav-label {
  margin-left: 10px;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.collapsed .nav-label {
  opacity: 0;
  width: 0;
  margin-left: 0;
}

.sidebar-footer {
  padding: 15px;
  border-top: 1px solid #2a2a2a;
}

.logout-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: 1px solid #ef854d;
  border-radius: 5px;
  color: #ef854d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background-color: #ef854d;
  color: white;
}

.logout-icon {
  font-size: 1.2rem;
}

.logout-text {
  margin-left: 10px;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.collapsed .logout-text {
  opacity: 0;
  width: 0;
  margin-left: 0;
}

/* Styles pour le scroll */
.sidebar-nav::-webkit-scrollbar {
  width: 5px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 5px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
