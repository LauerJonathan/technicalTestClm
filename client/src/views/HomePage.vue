<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import YearFlipCounter from "../components/YearFlipCounter.vue";
import nextMatches from "../components/nextMatches.vue";
import Podium from "../components/Podium.vue";

const date = ref(new Date().getFullYear());
const scrolled = ref(false);

const handleScroll = () => {
  scrolled.value = window.scrollY === 0;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <section class="home">
    <img src="../assets/logoClem.png" class="babyfoot" alt="logo babyfoot" />
    <YearFlipCounter :year="date" />
    <div class="navigation">
      <router-link to="/matches" class="ctr-item">📆 Calendrier</router-link>
      <router-link to="/results" class="ctr-item">🥇 Résultats</router-link>
      <router-link to="/register" class="ctr-item">⚽️ S'inscrire</router-link>
      <router-link to="/admin" class="ctr-item">👑 Admin</router-link>
    </div>
    <div class="dotDown" v-show="scrolled">⬇</div>
  </section>
  <section class="stats">
    <h1>Les prochains matchs :</h1>
    <nextMatches />
  </section>
</template>

<style scoped>
section.home {
  position: absolute;
  top: 0;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.home .title {
  display: flex;
  justify-content: center;
}
img.babyfoot {
  width: 200px;
  height: 200px;
}
.navigation {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 50px;
}
.navigation .ctr-item {
  background-color: rgb(18, 18, 18);
  padding: 10px;
  border-radius: 5px;
  transition: 500ms;
  cursor: pointer;
  border: 2px solid rgb(239, 133, 77);
  color: rgb(239, 133, 77);
  font-size: 1.2em;
}
.navigation .ctr-item:hover {
  transform: scale(1.1);
  transition: 500ms;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.dotDown {
  display: block;
  width: 40px;
  text-align: center;
  margin: 0 auto;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  font-size: 2em;
  position: absolute;
  left: calc(50% - 40px);
  bottom: -20px;
  transition: 500ms;
  animation: bounce 1.5s infinite;
}

section.stats {
  margin-top: 100vh;
  margin-bottom: 100px;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@media screen and (max-width: 600px) {
  .navigation {
    display: none;
  }
  .stats h1 {
    font-size: 1.9em;
  }
}
</style>
