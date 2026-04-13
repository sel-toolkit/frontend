<template>
  <ViewLayout>
    <t-card
      :hover-shadow="true"
      :header-bordered="true"
      class="flex items-center justify-center font-bold text-3xl size-full rounded-3xl"
    >
      <div class="flex flex-col items-center gap-2">
        <div>{{ $t("home.greet", { username: teacherName }) }}</div>
        <div>{{ $t("home.welcome") }}</div>
        <div class="text-sm font-normal text-gray-600 mt-2">
          {{ teacherEmail }}
        </div>
      </div>
    </t-card>
  </ViewLayout>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { t } = useI18n();
const teacherName = computed(() => authStore.teacher?.name ?? t("home.guest"));
const teacherEmail = computed(() => authStore.teacher?.email ?? "-");

</script>

<style scoped>
.t-drawer__footer .t-button {
  margin-left: 0;
}
</style>
