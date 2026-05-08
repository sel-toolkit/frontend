export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const isLoginPage = to.path === "/login";
  const authMeta = to.meta.auth;
  const isPublicRoute = authMeta === false;
  const isOptionalRoute = authMeta === "optional";

  if (!isPublicRoute) {
    try {
      await authStore.fetchMe();
    } catch {
      // fetchMe already clears the local session state when the backend returns 401.
    }
  }

  if (authStore.isAuthenticated && isLoginPage) {
    return navigateTo("/");
  }

  if (!authStore.isAuthenticated && !isPublicRoute && !isOptionalRoute && !isLoginPage) {
    return navigateTo({
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
