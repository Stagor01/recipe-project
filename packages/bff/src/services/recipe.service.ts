import { prisma } from "../prisma";

type RecipeInput = {
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

export const recipeService = {
  async getAll(skip = 0, take = 20) {
    return prisma.recipe.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  },

  async getById(id: string) {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        category: true,
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    return recipe;
  },

  async create(data: RecipeInput) {
    return prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,

        ingredients: {
          create: data.ingredients.map((i) => ({
            ingredientId: i.ingredientId,
            amount: i.amount,
            unit: i.unit,
          })),
        },

        tags: {
          create:
            data.tagIds?.map((tagId) => ({
              tagId,
            })) || [],
        },
      },
      include: {
        category: true,
        ingredients: {
          include: { ingredient: true },
        },
        tags: {
          include: { tag: true },
        },
      },
    });
  },

  async update(id: string, data: RecipeInput) {
    // 💥 важно: чистим связи
    await prisma.recipeIngredient.deleteMany({
      where: { recipeId: id },
    });

    await prisma.recipeTag.deleteMany({
      where: { recipeId: id },
    });

    return prisma.recipe.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,

        ingredients: {
          create: data.ingredients.map((i) => ({
            ingredientId: i.ingredientId,
            amount: i.amount,
            unit: i.unit,
          })),
        },

        tags: {
          create:
            data.tagIds?.map((tagId) => ({
              tagId,
            })) || [],
        },
      },
      include: {
        category: true,
        ingredients: {
          include: { ingredient: true },
        },
        tags: {
          include: { tag: true },
        },
      },
    });
  },

  async delete(id: string) {
    return prisma.recipe.delete({
      where: { id },
    });
  },
};
