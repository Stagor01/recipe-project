import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import recipeRoutes from "./routes/recipes";
import { ZodError } from "zod";

const app = Fastify({ logger: true });

app.register(cors, { origin: true });
app.register(multipart);

app.register(recipeRoutes, { prefix: "/recipes" });

app.setErrorHandler((error, request, reply) => {
  app.log.error(error);

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      errors: error.flatten(),
    });
  }

  return reply.status(500).send({
    message: "Internal server error",
  });
});

app.get("/health", async () => {
  return { status: "ok" };
});

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("Server running on http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
