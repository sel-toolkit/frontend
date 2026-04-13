export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const isLoginPage = to.path === "/login";

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/about"];
  const isPublicRoute = publicRoutes.includes(to.path);

  try {
    await authStore.fetchMe();
  } catch {
    // fetchMe already clears the local session state when the backend returns 401.
  }

  if (authStore.isAuthenticated && isLoginPage) {
    return navigateTo("/");
  }

  if (!authStore.isAuthenticated && !isPublicRoute && !isLoginPage) {
    return navigateTo({
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
