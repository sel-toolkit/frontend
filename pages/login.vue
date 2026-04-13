<template>
  <div class="min-h-screen w-full flex items-center justify-center px-6 bg-gradient-to-br from-slate-100 via-white to-emerald-100">
    <div class="w-full max-w-sm">
      <p class="mb-3 text-center text-sm text-gray-700">使用 Google 帳號登入/註冊</p>
      <div
        ref="googleButtonContainer"
        class="flex justify-center"
        aria-label="使用 Google 帳號登入或註冊"
      />

      <p v-if="isSubmitting" class="mt-4 text-sm text-gray-600 text-center">
        登入中...
      </p>

      <p v-if="errorMessage" class="mt-4 text-sm text-red-600 text-center">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleIdInitializeOptions {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

interface GoogleIdApi {
  initialize: (options: GoogleIdInitializeOptions) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type?: "standard" | "icon";
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "large" | "medium" | "small";
      text?: "signin_with" | "signup_with" | "continue_with" | "signin";
      shape?: "rectangular" | "pill" | "circle" | "square";
      width?: number;
      locale?: string;
      logo_alignment?: "left" | "center";
    }
  ) => void;
}

interface GoogleSdk {
  accounts: {
    id: GoogleIdApi;
  };
}

declare global {
  interface Window {
    google?: GoogleSdk;
  }
}

const runtimeConfig = useRuntimeConfig();
const authStore = useAuthStore();
const route = useRoute();
const isSubmitting = ref(false);
const errorMessage = ref("");
const isGoogleInitialized = ref(false);
const googleButtonContainer = ref<HTMLElement | null>(null);

const googleClientId = computed(() => runtimeConfig.public.googleClientId as string | undefined);

useHead({
  script: [
    {
      src: "https://accounts.google.com/gsi/client",
      async: true,
      defer: true,
    },
  ],
});

const waitForGoogleSdk = async () => {
  if (window.google?.accounts?.id) {
    return true;
  }

  return await new Promise<boolean>((resolve) => {
    const startedAt = Date.now();
    const timeoutMs = 5000;

    const timer = window.setInterval(() => {
      if (window.google?.accounts?.id) {
        window.clearInterval(timer);
        resolve(true);
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        window.clearInterval(timer);
        resolve(false);
      }
    }, 100);
  });
};

const setupGoogleButton = async () => {
  if (!googleClientId.value) {
    errorMessage.value = "缺少 Google Client ID 設定，請先設定 NUXT_GOOGLE_CLIENT_ID。";
    return;
  }

  const sdkReady = await waitForGoogleSdk();
  if (!sdkReady || !window.google?.accounts?.id) {
    errorMessage.value = "Google 登入服務載入失敗，請稍後再試。";
    return;
  }

  if (!isGoogleInitialized.value) {
    window.google.accounts.id.initialize({
      client_id: googleClientId.value,
      callback: handleGoogleCredential,
    });
    isGoogleInitialized.value = true;
  }

  if (googleButtonContainer.value) {
    googleButtonContainer.value.innerHTML = "";
    window.google.accounts.id.renderButton(googleButtonContainer.value, {
      type: "standard",
      theme: "filled_blue",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      width: 320,
      locale: "zh-TW",
      logo_alignment: "left",
    });
  }
};

const handleGoogleCredential = async (response: GoogleCredentialResponse) => {
  const idToken = response.credential;
  if (!idToken) {
    errorMessage.value = "無法取得 Google idToken，請再試一次。";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await authStore.loginWithGoogle(idToken);
    const redirectTarget =
      typeof route.query.redirect === "string" && route.query.redirect.length > 0
        ? route.query.redirect
        : "/";

    await navigateTo(redirectTarget);
  } catch {
    errorMessage.value = "登入失敗，請稍後再試。";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  await setupGoogleButton();
});
</script>
