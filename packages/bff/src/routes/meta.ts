import { FastifyInstance } from "fastify";
import { prisma } from "../prisma";

export default async function (app: FastifyInstance) {
  // Получить все категории
  app.get("/categories", async () => {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
  });

  // Получить все теги
  app.get("/tags", async () => {
    return prisma.tag.findMany({ orderBy: { name: "asc" } });
  });

  // Получить все ингредиенты
  app.get("/ingredients", async () => {
    return prisma.ingredient.findMany({ orderBy: { name: "asc" } });
  });
}
