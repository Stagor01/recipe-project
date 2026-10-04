import type { IngredientFormItem } from 'src/types/recipes';

export type RecipeForm = {
  title: string;
  description: string;
  imageUrl: string;

  categoryId: string | null;

  tagIds: string[];

  ingredients: IngredientFormItem[];
};
