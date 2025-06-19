import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AuthController {
  static async googleAuth(req: Request, res: Response) {
    try {
      console.log(req.body);
      const { token } = req.body;

      // Handle access token flow
      const googleUser = await AuthService.verifyGoogleAccessToken(token);

      if (!googleUser) {
        return res.status(401).json({ error: "Invalid Google token" });
      }

      console.log("Google user data:", googleUser);

      const user = await AuthService.findOrCreateUser(googleUser);
      console.log("User from database:", user);

      const tokens = AuthService.generateTokens(user);
      console.log("Generated tokens for user ID:", user.id);

      const completedSurvey = await prisma.completedSurvey.findFirst({
        where: {
          userId: user.id,
        },
      });

      return res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        completedSurvey,
        ...tokens,
      });
    } catch (error) {
      console.error("Google auth error:", error);
      return res.status(500).json({ error: "Authentication failed" });
    }
  }
}
