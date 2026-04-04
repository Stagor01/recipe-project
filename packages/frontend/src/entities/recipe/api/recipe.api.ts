import { api } from 'boot/axios';
import type { CreateRecipeDto, Recipe, UpdateRecipeDto } from 'src/types/models';

export const recipeApi = {
  getAll() {
    return api.get<Recipe[]>('/recipes');
  },

  getById(id: string) {
    return api.get<Recipe>(`/recipes/${id}`);
  },

  create(data: CreateRecipeDto) {
    return api.post<Recipe>('/recipes', data);
  },

  update(id: string, data: UpdateRecipeDto) {
    return api.put<Recipe>(`/recipes/${id}`, data);
  },

  delete(id: string) {
    return api.delete(`/recipes/${id}`);
  },
};
