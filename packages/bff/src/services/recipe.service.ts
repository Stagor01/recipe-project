import { prisma } from "../prisma";

export const recipeService = {
  async getAll(skip = 0, take = 20) {
    return prisma.recipe.findMany({
      include: { ingredients: true },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  },

  async getById(id: string) {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: { ingredients: true },
    });

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    return recipe;
  },

  async create(data: {
    title: string;
    description: string;
    imageUrl?: string;
    ingredients: string[];
  }) {
    return prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        ingredients: {
          create: data.ingredients.map((name) => ({ name })),
        },
      },
      include: { ingredients: true },
    });
  },

  async update(
    id: string,
    data: {
      title: string;
      description: string;
      imageUrl?: string;
      ingredients: string[];
    },
  ) {
    await prisma.ingredient.deleteMany({ where: { recipeId: id } });

    return prisma.recipe.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        ingredients: {
          create: data.ingredients.map((name) => ({ name })),
        },
      },
      include: { ingredients: true },
    });
  },

  async delete(id: string) {
    return prisma.recipe.delete({ where: { id } });
  },
};
