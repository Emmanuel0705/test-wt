import { Request, Response } from "express";
import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

export class SurveyController {
  static async createSurvey(req: Request, res: Response) {
    try {
      const { title, description, questions } = req.body;

      const survey = await prisma.survey.create({
        data: {
          title,
          description,
          questions: {
            create: questions.map((q: any, index: number) => ({
              question: q.question,
              type: q.type as QuestionType,
              options: q.options ? JSON.stringify(q.options) : null,
              required: q.required ?? true,
              order: index + 1,
            })),
          },
        },
        include: {
          questions: true,
        },
      });

      res.json(survey);
    } catch (error) {
      console.error("Create survey error:", error);
      res.status(500).json({ error: "Failed to create survey" });
    }
  }

  static async submitSurveyResponse(req: Request, res: Response) {
    try {
      console.log((req as any).user);
      const userId = (req as any).user.userId;
      const { responses, surveyId } = req.body;

      // Validate user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Validate survey exists
      const survey = await prisma.survey.findUnique({
        where: { id: surveyId },
      });

      if (!survey) {
        return res.status(404).json({ error: "Survey not found" });
      }

      console.log(responses);

      console.log({
        userId,
        surveyId,
        questionId: responses[0].questionId,
        answer: responses[0].answer,
      });

      // Create responses
      const createdResponses = await prisma.$transaction(
        responses.map((response: any) =>
          prisma.surveyResponse.create({
            data: {
              userId,
              surveyId,
              questionId: response.questionId,
              answer: response.answer,
            },
          })
        )
      );

      // Mark user as having submitted the survey
      await prisma.completedSurvey.create({
        data: {
          userId,
          surveyId,
        },
      });

      res.json(createdResponses);
    } catch (error) {
      console.error("Submit survey response error:", error);
      res.status(500).json({ error: "Failed to submit survey response" });
    }
  }

  static async getSurvey(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const userId = (req as any).user.userId;

      const survey = await prisma.survey.findUnique({
        where: { id: Number(id) },
        include: {
          questions: {
            orderBy: { id: "asc" },
          },
          completedSurvey: {
            where: {
              userId,
            },
          },
        },
      });

      if (!survey) {
        return res.status(404).json({ error: "Survey not found" });
      }

      const surveyWithCompleted = {
        ...survey,
        completedSurvey: survey.completedSurvey.length > 0,
      };

      res.json(surveyWithCompleted);
    } catch (error) {
      console.error("Get survey error:", error);
      res.status(500).json({ error: "Failed to get survey" });
    }
  }

  static async getActiveSurveys(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      // get active surveys with questions and add completed survey with user id, completedSurvey should be boolean value
      const surveys = await prisma.survey.findMany({
        where: { isActive: true },
        include: {
          completedSurvey: {
            where: {
              userId,
            },
          },
        },
      });

      const surveysWithCompleted = surveys.map((survey) => {
        return {
          ...survey,
          completedSurvey: survey.completedSurvey.length > 0,
        };
      });

      res.json(surveysWithCompleted);
    } catch (error) {
      console.error("Get active surveys error:", error);
      res.status(500).json({ error: "Failed to get active surveys" });
    }
  }

  static async getUserSurvey(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      // get survey with responses with survey id and user id

      const survey = await prisma.survey.findUnique({
        where: { id: Number(id) },
        include: {
          responses: {
            include: {
              question: true,
            },
            where: {
              userId,
            },
          },
        },
      });

      res.json(survey);
    } catch (error) {
      console.error("Get user survey error:", error);
      res.status(500).json({ error: "Failed to get user survey" });
    }
  }
}
