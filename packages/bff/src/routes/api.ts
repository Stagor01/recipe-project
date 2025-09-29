import { Router } from "express";

const router = Router();

// GET /api/items
router.get("/items", (req, res) => {
  res.json([{ id: 1, name: "Item A" }]);
});

// GET /api/items/:id
router.get("/items/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  res.json({ id, name: `Item ${id}` });
});

// POST /api/items
router.post("/items", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  // пока без базы, просто создаем
  const newItem = { id: Math.floor(Math.random() * 1000), name };

  res.status(201).json(newItem);
});

export default router;
