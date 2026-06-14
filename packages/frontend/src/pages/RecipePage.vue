<template>
  <q-page>
    <div class="recipe-cards p-4">
      <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
    </div>

    <q-btn
      icon="add"
      class="absolute-bottom-right q-mb-md q-mr-md"
      round
      size="xl"
      @click="addDialog = true"
    />

    <RecipesAddDialog v-model="addDialog" @created="fetchRecipes" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { recipesInfoStore } from 'stores/recipes-info-store';
import { storeToRefs } from 'pinia';
import { RecipeCard, RecipesAddDialog } from 'components/recipes';

const store = recipesInfoStore();

const { recipes } = storeToRefs(store);
const { fetchRecipes } = store;

const addDialog = ref(false);

onMounted(fetchRecipes);
</script>

<style scoped lang="scss">
.recipe-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1920px) {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
