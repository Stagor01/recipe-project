import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes/api";

dotenv.config();

const app = express();

// middlewars
app.use(cors());
app.use(express.json());

// простой маршрут
app.get("/api/hello", (req, res) => {
  res.json({ msg: "Hello from bff" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 BFF running on http://localhost:${PORT}`);
});

app.use("/api", apiRouter);
