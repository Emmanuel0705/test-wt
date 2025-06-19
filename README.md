# Express TypeScript API with Prisma and PostgreSQL

This is a boilerplate for building REST APIs with Express.js, TypeScript, and PostgreSQL using Prisma as the ORM.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/waterlily_db?schema=public"
   PORT=3000
   ```

4. Update the DATABASE_URL in `.env` with your PostgreSQL credentials

5. Initialize the database:

   ```bash
   npm run prisma:migrate
   ```

6. Generate Prisma Client:
   ```bash
   npm run prisma:generate
   ```

## Development

To start the development server:

```bash
npm run dev
```

The server will start at http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio to manage your database

## Project Structure

```
├── src/
│   └── app.ts          # Main application file
├── prisma/
│   └── schema.prisma   # Database schema
├── dist/              # Compiled JavaScript files
├── .env              # Environment variables
├── package.json
└── tsconfig.json
```
