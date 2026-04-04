<template>
  <q-page></q-page>
</template>

<script setup lang="ts">
import { recipesInfoStore } from 'stores/recipes-info-store';
// import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const store = recipesInfoStore();

// const { recipes, loading } = storeToRefs(store);
const { fetchRecipes } = store;

onMounted(() => fetchRecipes());
</script>
