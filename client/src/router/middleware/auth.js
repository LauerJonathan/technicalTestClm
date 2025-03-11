import { useAuthStore } from "../store/auth";

export const requireAuth = (to, from, next) => {
  const authStore = useAuthStore();

  if (authStore.isAuthenticated) {
    next();
  } else {
    next("/login");
  }
};
