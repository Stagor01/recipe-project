import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../prisma";

export default async function (app: FastifyInstance) {
  // Схема для создания/обновления рецепта
  const recipeSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    imageUrl: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    ingredients: z.array(
      z.object({
        ingredientId: z.string().uuid(),
        amount: z.number(),
        unit: z.string(),
      }),
    ),
    tagIds: z.array(z.string().uuid()).optional(),
  });

  // GET /recipes с пагинацией
  app.get("/", async (request) => {
    const { page = 1, limit = 20 } = request.query as {
      page?: number;
      limit?: number;
    };
    const skip = (Number(page) - 1) * Number(limit);

    return prisma.recipe.findMany({
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        ingredients: { include: { ingredient: true } },
        tags: { include: { tag: true } },
      },
    });
  });

  // GET /recipes/:id
  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        category: true,
        ingredients: { include: { ingredient: true } },
        tags: { include: { tag: true } },
      },
    });

    if (!recipe) {
      return reply.status(404).send({ message: "Recipe not found" });
    }
    return recipe;
  });

  // POST /recipes
  app.post("/", async (request) => {
    const data = recipeSchema.parse(request.body);

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
          create: data.tagIds?.map((tagId) => ({ tagId })) || [],
        },
      },
      include: {
        category: true,
        ingredients: { include: { ingredient: true } },
        tags: { include: { tag: true } },
      },
    });
  });

  // PUT /recipes/:id
  app.put("/:id", async (request) => {
    const { id } = request.params as { id: string };
    const data = recipeSchema.parse(request.body);

    // Удаляем старые связи
    await prisma.recipeIngredient.deleteMany({ where: { recipeId: id } });
    await prisma.recipeTag.deleteMany({ where: { recipeId: id } });

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
          create: data.tagIds?.map((tagId) => ({ tagId })) || [],
        },
      },
      include: {
        category: true,
        ingredients: { include: { ingredient: true } },
        tags: { include: { tag: true } },
      },
    });
  });

  // DELETE /recipes/:id
  app.delete("/:id", async (request) => {
    const { id } = request.params as { id: string };
    return prisma.recipe.delete({ where: { id } });
  });

  // Дополнительные справочники для фронта
  app.get("/ingredients", async () => prisma.ingredient.findMany());
  app.get("/categories", async () => prisma.category.findMany());
  app.get("/tags", async () => prisma.tag.findMany());
}
