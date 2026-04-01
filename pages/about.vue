<template>
  <ViewLayout>
    <div class="flex flex-col min-h-full overflow-y-auto">
      <div class="flex flex-wrap justify-center gap-6 p-4">
        <t-card
          v-for="member in computedMembers"
          :key="member.email"
          :header-bordered="true"
          hover-shadow
          class="rounded-xl bg-gradient-to-r from-green-200 via-blue-100 to-purple-200 !text-black w-80"
        >
          <template #title>
            <div class="text-black text-lg font-bold">{{ member.name }}</div>
          </template>

          <template #subtitle>
            <div class="text-sm text-gray-600">{{ member.title }}</div>
          </template>

          <div class="text-sm text-gray-700 mb-2">
            <span class="font-semibold">{{ $t("team.desc") }}：</span>
            <span v-if="member.description.startsWith('http')">
              <a
                :href="member.description"
                class="text-blue-500 underline"
                target="_blank"
                >{{ $t("team.githubLink") }}</a
              >
            </span>
            <span v-else>{{ member.description || "-" }}</span>
          </div>

          <div class="text-sm text-gray-700 mb-2">
            <span class="font-semibold">{{ $t("team.role") }}：</span
            >{{ member.role || "-" }}
          </div>

          <div class="text-sm text-gray-700 mb-2">
            <span class="font-semibold">{{ $t("team.phone") }}：</span
            >{{ member.phone || "-" }}
          </div>

          <div class="text-sm text-gray-700">
            <span class="font-semibold">{{ $t("team.email") }}：</span>
            <a
              v-if="member.email"
              :href="`mailto:${member.email}`"
              class="text-blue-500 underline"
              >{{ member.email }}</a
            >
            <span v-else>-</span>
          </div>
        </t-card>
      </div>
    </div>
  </ViewLayout>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const computedMembers = computed(() =>
  members.map((member) => translateMember(member, locale.value))
);

interface Member {
  name: string;
  title: string;
  description: string;
  role: string;
  phone: string;
  email: string;
}

const members: Member[] = [
  {
    name: "蘇子權 (SubaRya)",
    title: "臺師大資工系、五股國中資訊科技專科老師",
    description: "https://github.com/KutsunaSubaRya",
    role: "系統平台開發與維護",
    phone: "-",
    email: "index20010928@gmail.com",
  }
];

const translateMember = (member: Member, locale: string) => {
  const translatedTitle =
    locale === "en"
      ? member.title
          .replace("臺師大", "NTNU ")
          .replace("資工系", "CSIE ")
          .replace("五股國中資訊科技專科老師", "Wugu Junior High School IT Teacher")
      : member.title;

  const translatedRole =
    locale === "en"
      ? member.role
          .replace("技術指導", "Technical Advisor")
          .replace("系統平台開發與維護", "Platform Development & Maintenance")
          .replace("硬體架設", "Hardware Setup")
      : member.role;

  return {
    ...member,
    title: translatedTitle,
    role: translatedRole,
  };
};
</script>


<style scoped>
:deep(.t-layout__content) {
  height: 100%;
  overflow-y: auto;
}
</style>