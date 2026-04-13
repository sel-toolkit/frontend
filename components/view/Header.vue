<template>
  <t-header class="flex items-center">
    <t-head-menu default-value="2-1" expand-type="popup">
      <template #logo>
        <div
          class="font-bold text-xl small-tablet:text-md ml-8"
          @click="goTo('/')"
        >
          SEL 工具包
        </div>
      </template>

      <t-menu-item
        value="4"
        class="text-md font-semibold mobile:!hidden"
        @click="goTo('/about')"
      >
        {{ $t("menu.aboutUs") }}
      </t-menu-item>

      <template #operations>
        <t-space class="flex items-center gap-4">
          <t-space class="items-center gap-2 mobile:!hidden">
            <span
              v-if="authStore.isAuthenticated"
              class="text-sm text-gray-700 font-medium"
            >
              {{ authStore.teacher?.name }}
            </span>
            <t-button
              v-if="authStore.isAuthenticated"
              theme="primary"
              variant="text"
              @click="handleLogout"
            >
              登出
            </t-button>
            <t-button
              v-else
              theme="primary"
              variant="text"
              @click="handleLogin"
            >
              登入
            </t-button>
          </t-space>
          <t-switch
            :model-value="checked"
            size="large"
            class="mobile:!hidden"
            @change="onChangeSwitch"
          >
            <template #label="slotProps">
              <template v-if="slotProps.value">
                <MoonIcon />
              </template>
              <template v-else>
                <SunnyIcon />
              </template>
            </template>
          </t-switch>
          <t-space>
            <t-dropdown
              class="mobile:!hidden"
              :options="i18nOptions"
              @click="clickI18NHandler"
            >
              <t-button variant="text" shape="square">
                <TranslateIcon />
              </t-button>
            </t-dropdown>
          </t-space>
          <t-button
            class="tablet:!hidden"
            variant="text"
            shape="square"
            @click="toggleDrawer"
          >
            <template #icon>
              <MenuUnfoldIcon />
            </template>
          </t-button>
        </t-space>
      </template>
    </t-head-menu>
  </t-header>
  <!-- Drawer for mobile menu -->
  <t-drawer
    v-model:visible="isDrawerVisible"
    :prevent-scroll-through="true"
    :close-on-overlay-click="true"
    :show-overlay="true"
    placement="right"
    size="300px"
    class="!h-full flex flex-col items-center justify-center"
  >
    <template #header>
      <div>{{ $t("menu.menu") }}</div>
    </template>
    <t-menu theme="light" class="flex flex-col space-y-2 items-center !w-full">
      <t-menu-item value="4" class="w-full" @click="goTo('/about')"
        >{{ $t("menu.aboutUs") }}
      </t-menu-item>
    </t-menu>
    <template #footer>
      <div class="flex flex-col w-full">
        <div class="flex justify-center mb-2">
          <t-button
            v-if="authStore.isAuthenticated"
            theme="primary"
            block
            @click="handleLogout"
          >
            {{ authStore.teacher?.name }} / 登出
          </t-button>
          <t-button v-else theme="primary" block @click="handleLogin">
            登入
          </t-button>
        </div>
        <div class="flex justify-center mb-2">
          <t-switch
            :model-value="checked"
            size="large"
            @change="onChangeSwitch"
          >
            <template #label="slotProps">
              <template v-if="slotProps.value">
                <MoonIcon />
              </template>
              <template v-else>
                <SunnyIcon />
              </template>
            </template>
          </t-switch>
        </div>
        <t-dropdown
          class="w-full !ml-0"
          :options="i18nOptions"
          @click="clickI18NHandler"
        >
          <t-button class="!w-full !ml-0" variant="text" shape="square">
            <template #icon>
              <TranslateIcon class="mr-1" />
              {{ $t("menu.language") }}
            </template>
          </t-button>
        </t-dropdown>
      </div>
    </template>
  </t-drawer>
</template>
<script setup lang="ts">
import {
  MenuUnfoldIcon,
  SunnyIcon,
  MoonIcon,
  TranslateIcon,
} from "tdesign-icons-vue-next";
import type { DropdownOption, SwitchProps } from "tdesign-vue-next";
import { useLangStore } from "~/stores/i18n";

interface I18NOption {
  content: string;
  value: string;
}

type LocaleCode = "zh-tw" | "en";

const i18NStore = useLangStore();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const isDrawerVisible = ref(false);
const checked = computed({
  get: () => themeStore.mode === "dark",
  set: (val: boolean) => {
    themeStore.setTheme(val ? "dark" : "light");
  },
});
const { setLocale } = useI18n();
const toggleDrawer = () => {
  isDrawerVisible.value = !isDrawerVisible.value;
};

const onChangeSwitch: SwitchProps["onChange"] = (val) => {
  const newMode = val ? "dark" : "light";
  themeStore.setTheme(newMode);
};

const goTo = async (path: string) => {
  return navigateTo(path);
};

const handleLogin = async () => {
  isDrawerVisible.value = false;
  await navigateTo({
    path: "/login",
    query: {
      redirect: useRoute().fullPath,
    },
  });
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    isDrawerVisible.value = false;
    await navigateTo("/login");
    await MessagePlugin.success("已登出");
  } catch {
    await MessagePlugin.error("登出失敗，請稍後再試。");
  }
};

const i18nOptions: I18NOption[] = [
  {
    content: "繁體中文",
    value: "zh-tw",
  },
  {
    content: "English",
    value: "en",
  },
];

const clickI18NHandler = async (dropdownItem: DropdownOption) => {
  const data = dropdownItem as I18NOption;
  const value = data.value as LocaleCode;
  i18NStore.setLanguage(data.value);
  await setLocale(value);
  await MessagePlugin.success(`${data.content}`);
};

onMounted(() => {
  themeStore.initTheme();
  checked.value = themeStore.mode === "dark";
});

</script>
