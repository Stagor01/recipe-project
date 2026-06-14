import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Category, Ingredient, Tag } from 'src/types/models';
import { metaApi } from 'src/entities/recipe/api/meta.api';

export const useMetaStore = defineStore('meta', () => {
  const loading = ref(false);

  const categories = ref<Category[]>([]);
  const tags = ref<Tag[]>([]);
  const ingredients = ref<Ingredient[]>([]);

  const fetchCategories = async () => {
    loading.value = true;
    try {
      const { data } = await metaApi.getCategories();
      categories.value = data;
    } finally {
      loading.value = false;
    }
  };

  const fetchTags = async () => {
    loading.value = true;
    try {
      const { data } = await metaApi.getTags();
      tags.value = data;
    } finally {
      loading.value = false;
    }
  };

  const fetchIngredients = async () => {
    loading.value = true;
    try {
      const { data } = await metaApi.getIngredients();
      ingredients.value = data;
    } finally {
      loading.value = false;
    }
  };

  return {
    categories,
    tags,
    ingredients,
    loading,
    fetchCategories,
    fetchTags,
    fetchIngredients,
  };
});
