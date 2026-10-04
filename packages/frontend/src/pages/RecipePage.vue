<template>
  <q-page>
    <div class="recipe-cards p-4">
      <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" @click="openRecipe" />
    </div>

    <q-page-sticky position="bottom-right" :offset="[24, 24]">
      <q-btn icon="add" round size="xl" @click="addDialog = true" />
    </q-page-sticky>

    <RecipesAddDialog v-model="addDialog" @created="fetchRecipes" />

    <RecipeDetailsDialog
      v-model="detailsDialog"
      :recipe-id="selectedRecipeId"
      @updated="fetchRecipes"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { recipesInfoStore } from 'stores/recipes-info-store';
import { storeToRefs } from 'pinia';
import { RecipeCard, RecipeDetailsDialog, RecipesAddDialog } from 'components/recipes';

const store = recipesInfoStore();

const { recipes } = storeToRefs(store);
const { fetchRecipes } = store;

const addDialog = ref(false);

const detailsDialog = ref(false);

const selectedRecipeId = ref<string | null>(null);

const openRecipe = (recipeId: string) => {
  selectedRecipeId.value = recipeId;

  detailsDialog.value = true;
};

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
