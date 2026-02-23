import { FastifyInstance } from "fastify";
import { z } from "zod";
import { recipeService } from "../services/recipe.service";

export default async function (app: FastifyInstance) {
  const recipeSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    imageUrl: z.string().optional(),
    ingredients: z.array(z.string().min(1)),
  });

  // GET с pagination
  app.get("/", async (request) => {
    const { page = 1, limit = 20 } = request.query as {
      page?: number;
      limit?: number;
    };

    const skip = (Number(page) - 1) * Number(limit);

    return recipeService.getAll(skip, Number(limit));
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      return await recipeService.getById(id);
    } catch (error) {
      return reply.status(404).send({
        message: "Recipe not found",
      });
    }
  });

  app.post("/", async (request) => {
    const data = recipeSchema.parse(request.body);
    return recipeService.create(data);
  });

  app.put("/:id", async (request) => {
    const { id } = request.params as { id: string };
    const data = recipeSchema.parse(request.body);
    return recipeService.update(id, data);
  });

  app.delete("/:id", async (request) => {
    const { id } = request.params as { id: string };
    return recipeService.delete(id);
  });
}
