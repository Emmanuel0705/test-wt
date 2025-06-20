import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { AuthController } from "./controllers/auth.controller";
import { authMiddleware } from "./middleware/auth.middleware";
import { SurveyController } from "./controllers/survey.controller";

dotenv.config();

const app: Express = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth routes
app.post("/api/auth/google", AuthController.googleAuth);

// Survey routes
app.post("/api/surveys", authMiddleware, SurveyController.createSurvey);
app.get("/api/surveys", authMiddleware, SurveyController.getActiveSurveys);
app.get("/api/surveys/:id", authMiddleware, SurveyController.getSurvey);
app.get(
  "/api/surveys/review/:id",
  authMiddleware,
  SurveyController.getUserSurvey
);
app.post(
  "/api/surveys/submit",
  authMiddleware,
  SurveyController.submitSurveyResponse
);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript + Prisma API" });
});

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
