export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  ingredients: {
    id: string;
    name: string;
  }[];
  createdAt: string;
}

export interface CreateRecipeDto {
  title: string;
  description: string;
  imageUrl?: string;
  ingredients: string[];
}

export type UpdateRecipeDto = CreateRecipeDto;
