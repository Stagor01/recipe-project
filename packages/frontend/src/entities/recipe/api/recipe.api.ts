import { api } from 'boot/axios';

export const recipeApi = {
  getAll(params?: { page?: number; limit?: number }) {
    return api.get('/recipes', { params });
  },

  getById(id: string) {
    return api.get(`/recipes/${id}`);
  },

  create(data: any) {
    return api.post('/recipes', data);
  },

  update(id: string, data: any) {
    return api.put(`/recipes/${id}`, data);
  },

  delete(id: string) {
    return api.delete(`/recipes/${id}`);
  },
};
