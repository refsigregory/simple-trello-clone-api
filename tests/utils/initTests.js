import express from "express";
import dotenv from "dotenv";
import authRoutes from "../../routes/auth.routes.js";
import userRoutes from "../../routes/users.routes.js";
import boardRoutes from "../../routes/board.routes.js";
import columnRoutes from "../../routes/column.routes.js";
import taskRoutes from "../../routes/task.routes.js";

const app = express();

dotenv.config();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/board", boardRoutes);
app.use("/api/column", columnRoutes);
app.use("/api/task", taskRoutes);

export default app;