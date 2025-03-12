import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomePage.vue";
import Matches from "../views/Matches.vue";
import Results from "../views/admin/Results.vue";
import Registration from "../views/Registration.vue";
import AdminLogin from "../views/AdminLogin.vue";
import AdminLayout from "../views/admin/adminLayout.vue";
import authStore from "../store/auth";

const routes = [
  // Routes publiques
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/matches",
    name: "matches",
    component: Matches,
  },
  {
    path: "/results",
    name: "results",
    component: Results,
  },
  {
    path: "/register",
    name: "register",
    component: Registration,
  },
  {
    path: "/admin/login",
    name: "adminLogin",
    component: AdminLogin,
  },

  // Routes d'administration (protégées)
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "tournements",
        component: () => import("../views/admin/Tournaments.vue"),
      },
      {
        path: "teams",
        name: "adminTeams",
        component: () => import("../views/admin/Teams.vue"),
      },
      {
        path: "/admin/tournaments/:id",
        name: "TournamentDetails",
        component: () => import("../views/TournamentDetails.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // Si l'utilisateur essaie d'accéder à la page de connexion alors qu'il est déjà connecté
  if (to.path === "/admin/login" && authStore.state.isAuthenticated) {
    next({ path: "/admin" });
    return;
  }

  // Vérifier si la route nécessite une authentification
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.state.isAuthenticated) {
      next({
        path: "/admin/login",
        query: { redirect: to.fullPath }, // Stocke l'URL de destination
      });
    } else {
      next();
    }
  } else {
    // Route publique, autoriser l'accès
    next();
  }
});

export default router;
