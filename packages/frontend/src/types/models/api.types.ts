export type Ingredient = {
  id: string;
  name: string;
  unit?: string;
};

export type RecipeIngredient = {
  id: string;
  amount: number;
  unit: string;
  ingredient: Ingredient;
};

export type Tag = {
  id: string;
  name: string;
};

export type RecipeTag = {
  tag: Tag;
};

export type Category = {
  id: string;
  name: string;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category?: Category;
  ingredients: RecipeIngredient[];
  tags: RecipeTag[];
};

// DTO для создания рецепта
export type CreateRecipeDto = {
  title: string;
  description: string;
  imageUrl?: string;
  categoryId?: string;
  ingredients: {
    ingredientId: string;
    amount: number;
    unit: string;
  }[];
  tagIds?: string[];
};

// DTO для обновления рецепта
export type UpdateRecipeDto = CreateRecipeDto;
