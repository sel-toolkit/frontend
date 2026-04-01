<template>
  <ViewLayout>
    <t-card
      :hover-shadow="true"
      :header-bordered="true"
      class="flex items-center justify-center font-bold text-3xl size-full rounded-3xl"
    >
      <div>{{ $t('home.greet', { username }) }}</div>
      <div>{{ $t('home.welcome') }}</div>
    </t-card>
  </ViewLayout>
</template>

<script setup lang="ts">
const username = ref("");
const { t } = useI18n();

onMounted(async () => {
  // TODO: remove annotation after login is implemented
  // if (user.isLogin) {
  //   username.value = user.user.username;
  // } else {
    username.value = t('home.guest');
  // }
});
</script>

<style scoped>
.t-drawer__footer .t-button {
  margin-left: 0;
}
</style>
