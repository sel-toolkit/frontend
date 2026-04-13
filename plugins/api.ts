import { $fetch } from "ofetch";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl ?? "http://localhost:8001",
    credentials: "include",
  });

  return {
    provide: {
      api,
    },
  };
});

declare module "#app" {
  interface NuxtApp {
    $api: typeof $fetch;
  }
}

export {};
