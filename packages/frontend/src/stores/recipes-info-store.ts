import { defineStore } from 'pinia';
import { ref } from 'vue';
import { recipeApi } from 'src/entities/recipe/api/recipe.api';
import type { Recipe } from 'src/types/models';

export const recipesInfoStore = defineStore('recipes', () => {
  const recipes = ref<Array<Recipe>>([]);
  const loading = ref(false);

  const fetchRecipes = async () => {
    try {
      loading.value = true;

      const { data } = await recipeApi.getAll();
      recipes.value = data;
    } catch {
      console.error('Failed to fetch recipes.');
    } finally {
      loading.value = false;
    }
  };

  return {
    recipes,
    loading,
    fetchRecipes,
  };
});
