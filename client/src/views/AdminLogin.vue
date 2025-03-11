<template>
  <div class="login-container">
    <div class="login-card">
      <img
        src="../assets/logoClem.png"
        class="login-logo"
        alt="logo babyfoot" />
      <h1>Espace Administrateur</h1>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <input
            type="text"
            id="username"
            v-model="username"
            required
            placeholder="Entrez votre nom d'utilisateur" />
        </div>

        <div class="form-group">
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Entrez votre mot de passe" />
        </div>

        <div v-if="authStore.state.error" class="error-message">
          {{ authStore.state.error }}
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="authStore.state.isLoading">
          <span v-if="authStore.state.isLoading">Connexion en cours...</span>
          <span v-else>Se connecter</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import authStore from "../store/auth";

const router = useRouter();
const route = useRoute();

const username = ref("");
const password = ref("");

// Nettoyage des erreurs au montage du composant
onMounted(() => {
  authStore.clearError();
});

// Redirection si déjà authentifié
onMounted(() => {
  if (authStore.state.isAuthenticated) {
    router.push("/admin");
  }
});

const handleLogin = async () => {
  try {
    await authStore.login(username.value, password.value);

    // Si la connexion réussit, rediriger vers l'URL stockée dans query ou le dashboard par défaut
    const redirectUrl = route.query.redirect || "/admin";
    router.push(redirectUrl);
  } catch (err) {
    // Les erreurs sont déjà gérées dans le store
    console.error("Erreur lors de la connexion:", err);
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  margin-top: -100px;
  background-color: #f5f5f5;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: rgb(18, 18, 18);
  border: 2px solid rgb(239, 133, 77);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin: 0 auto 20px;
  display: block;
}

h1 {
  text-align: center;
  color: rgb(239, 133, 77);
  margin-bottom: 30px;
  font-size: 1.8em;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  color: white;
  font-size: 1em;
}

input {
  padding: 12px;
  border: 1px solid rgba(239, 133, 77, 0.5);
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  color: white;
  font-size: 1em;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: rgb(239, 133, 77);
  box-shadow: 0 0 0 2px rgba(239, 133, 77, 0.3);
}

.login-button {
  background-color: rgb(239, 133, 77);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.login-button:hover {
  background-color: rgb(255, 150, 100);
  transform: translateY(-2px);
}

.login-button:disabled {
  background-color: rgba(239, 133, 77, 0.6);
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #ff6b6b;
  font-size: 0.9em;
  text-align: center;
  padding: 5px;
  background-color: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
}
</style>
