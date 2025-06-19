import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Customer Feedback Survey
  const customerFeedbackSurvey = await prisma.survey.create({
    data: {
      title: "Customer Feedback Survey",
      description: "Help us improve our service by providing your feedback",
      isActive: true,
      questions: {
        create: [
          {
            title: "How satisfied are you with our service?",
            description:
              "Please rate your overall satisfaction with our service",
            type: QuestionType.number,
            isRequired: true,
          },
          {
            title: "What aspects of our service could be improved?",
            description: "Please share your thoughts on areas for improvement",
            type: QuestionType.long_text,
            isRequired: true,
          },
          {
            title: "When did you first use our service?",
            description: "Please provide the approximate date",
            type: QuestionType.date,
            isRequired: false,
          },
          {
            title: "What is your primary use case?",
            description: "Briefly describe how you use our service",
            type: QuestionType.short_text,
            isRequired: true,
          },
        ],
      },
    },
  });

  // Create Product Research Survey
  const productResearchSurvey = await prisma.survey.create({
    data: {
      title: "Product Research Survey",
      description: "Help us understand your needs better",
      isActive: true,
      questions: {
        create: [
          {
            title: "How often do you use our product?",
            description: "Please indicate your usage frequency",
            type: QuestionType.number,
            isRequired: true,
          },
          {
            title: "What challenges do you face while using our product?",
            description: "Please describe any difficulties you encounter",
            type: QuestionType.long_text,
            isRequired: true,
          },
          {
            title: "When did you start using our product?",
            description: "Please provide the start date",
            type: QuestionType.date,
            isRequired: false,
          },
          {
            title: "What is your role?",
            description: "Briefly describe your role or position",
            type: QuestionType.short_text,
            isRequired: true,
          },
        ],
      },
    },
  });

  // Create User Experience Survey
  const userExperienceSurvey = await prisma.survey.create({
    data: {
      title: "User Experience Survey",
      description: "Help us improve your experience with our platform",
      isActive: true,
      questions: {
        create: [
          {
            title: "How would you rate the overall user experience?",
            description: "Please rate from 1 to 10",
            type: QuestionType.number,
            isRequired: true,
          },
          {
            title: "What would make your experience better?",
            description: "Please share your suggestions for improvement",
            type: QuestionType.long_text,
            isRequired: true,
          },
          {
            title: "When did you last use our platform?",
            description: "Please provide the date of your last visit",
            type: QuestionType.date,
            isRequired: false,
          },
          {
            title: "What device do you primarily use?",
            description: "Briefly describe your primary device",
            type: QuestionType.short_text,
            isRequired: true,
          },
        ],
      },
    },
  });

  // Create User
  const user = await prisma.user.create({
    data: {
      email: "test@test.com",
      name: "Test User",
      completedSurvey: {
        create: [
          { surveyId: customerFeedbackSurvey.id },
          { surveyId: productResearchSurvey.id },
          { surveyId: userExperienceSurvey.id },
        ],
      },
    },
  });

  console.log(user);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
