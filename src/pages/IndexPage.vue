<template>
  <q-page class="flex flex-col items-center justify-center p-4">
    <h1 class="text-4xl font-bold mb-4">{{ t('mainPage.title') }}</h1>
    <p class="text-lg">{{ t('mainPage.labels.welcome') }}</p>
    <q-btn :label="t('mainPage.buttons.labels.start')" class="mt-4 bg-orange-300" />
  </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
