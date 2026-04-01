<template>
  <t-layout class="h-screen">
    <Header />
    <t-layout class="flex-1 flex m-2">
      <Content
        class="flex-1 pt-0.5 px-0.5 flex items-center justify-center flex-col"
      >
        <slot />
      </Content>
    </t-layout>
    <Footer />
  </t-layout>
</template>

<script setup lang="ts">
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import { Content } from "tdesign-vue-next";
</script>

<style scoped>
.t-layout {
  overflow: hidden; /* Prevent page-level scrolling */
}
</style>
