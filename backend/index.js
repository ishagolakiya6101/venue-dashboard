import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

export default app; // ✅ REQUIRED FOR VERCEL
