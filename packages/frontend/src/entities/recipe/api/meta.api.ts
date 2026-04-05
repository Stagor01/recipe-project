import { api } from 'boot/axios';
import type { Category, Ingredient, Tag } from 'src/types/models';

export const metaApi = {
  getCategories() {
    return api.get<Category[]>('/categories');
  },

  getTags() {
    return api.get<Tag[]>('/tags');
  },

  getIngredients() {
    return api.get<Ingredient[]>('/ingredients');
  },
};
