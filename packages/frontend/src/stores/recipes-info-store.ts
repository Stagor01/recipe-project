import { defineStore } from 'pinia';
import { ref } from 'vue';
import { recipeApi } from 'src/entities/recipe/api/recipe.api';
import type { CreateRecipeDto, Recipe, UpdateRecipeDto } from 'src/types/models';

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

  const createRecipe = async (payload: CreateRecipeDto) => {
    loading.value = true;
    try {
      const { data } = await recipeApi.create(payload);

      recipes.value.unshift(data);

      return data;
    } finally {
      loading.value = false;
    }
  };

  const fetchRecipe = async (id: string): Promise<Recipe> => {
    loading.value = true;

    try {
      const { data } = await recipeApi.getById(id);

      return data;
    } finally {
      loading.value = false;
    }
  };

  const updateRecipe = async (id: string, payload: UpdateRecipeDto): Promise<Recipe> => {
    loading.value = true;

    try {
      const { data } = await recipeApi.update(id, payload);

      const index = recipes.value.findIndex((recipe) => recipe.id === id);

      if (index !== -1) {
        recipes.value[index] = data;
      }

      return data;
    } finally {
      loading.value = false;
    }
  };

  return {
    recipes,
    loading,

    fetchRecipes,
    fetchRecipe,

    createRecipe,
    updateRecipe,
  };
});
