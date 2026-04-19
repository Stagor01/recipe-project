import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Category, Tag } from 'src/types/models';
import { metaApi } from 'src/entities/recipe/api/meta.api';

export const useMetaStore = defineStore('meta', () => {
  const loading = ref(false);

  const categories = ref<Category[]>([]);
  const tags = ref<Tag[]>([]);

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

  return {
    categories,
    tags,
    loading,
    fetchCategories,
    fetchTags,
  };
});
