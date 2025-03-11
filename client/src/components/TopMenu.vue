<template>
  <nav class="top-menu">
    <div class="logo-container">
      <router-link to="/" class="home-item menu-item">
        <img
          src="../assets/logoClem.png"
          class="mini-logo"
          alt="logo babyfoot" />
        Accueil
      </router-link>
    </div>
    <div class="menu-items">
      <router-link to="/matches" class="menu-item" active-class="active">
        <span class="icon">📆</span>
        <span class="text">Calendrier</span>
      </router-link>
      <router-link to="/results" class="menu-item" active-class="active">
        <span class="icon">🥇</span>
        <span class="text">Résultats</span>
      </router-link>
      <router-link to="/register" class="menu-item" active-class="active">
        <span class="icon">⚽️</span>
        <span class="text">S'inscrire</span>
      </router-link>
      <router-link to="/admin" class="menu-item" active-class="active">
        <span class="icon">👑</span>
        <span class="text">Admin</span>
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
.router-link-active {
  color: rgb(239, 133, 77);
}
.menu-item {
  text-decoration: none;
}
.home-item {
  display: flex;
  align-items: center;
  gap: 30px;
}
.top-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: rgba(18, 18, 18, 0.9);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  backdrop-filter: blur(5px);
  border-bottom: 2px solid rgb(239, 133, 77);
}

.logo-container {
  display: flex;
  align-items: center;
}

.mini-logo {
  height: 40px;
  width: 40px;
  object-fit: contain;
}

.menu-items {
  display: flex;
  gap: 10px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  position: relative;
}

.menu-item::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: rgb(239, 133, 77);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.menu-item:hover::after,
.menu-item.active::after {
  width: 100%;
}

.menu-item:hover,
.menu-item.active {
  color: rgb(239, 133, 77);
}

.icon {
  margin-right: 5px;
}

/* Pour les écrans plus petits, n'afficher que les icônes */
@media (max-width: 600px) {
  .text {
    display: none;
  }

  .menu-item {
    padding: 5px;
  }

  .icon {
    margin-right: 0;
    font-size: 1.2em;
  }
}
</style>
