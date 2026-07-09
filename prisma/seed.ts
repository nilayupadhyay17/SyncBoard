import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  // Clear existing seed data so re-runs are idempotent
  await prisma.card.deleteMany();
  await prisma.list.deleteMany();
  await prisma.boardMember.deleteMany();
  await prisma.board.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@syncboard.dev",
      passwordHash,
    },
  });

  const board = await prisma.board.create({
    data: {
      title: "Product Launch",
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });

  const todoList = await prisma.list.create({
    data: {
      title: "To Do",
      position: 1000,
      boardId: board.id,
    },
  });

  const inProgressList = await prisma.list.create({
    data: {
      title: "In Progress",
      position: 2000,
      boardId: board.id,
    },
  });

  await prisma.card.createMany({
    data: [
      {
        title: "Write product brief",
        description: "Outline goals, audience, and success metrics.",
        position: 1000,
        listId: todoList.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Design landing page",
        description: "Wireframes and visual mockups for the marketing site.",
        position: 2000,
        listId: todoList.id,
      },
      {
        title: "Set up analytics",
        description: null,
        position: 3000,
        listId: todoList.id,
      },
      {
        title: "Build auth flow",
        description: "Email/password sign-in and session handling.",
        position: 1000,
        listId: inProgressList.id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Kanban board UI",
        description: "Lists, cards, and drag-and-drop scaffolding.",
        position: 2000,
        listId: inProgressList.id,
      },
    ],
  });

  console.log("Seed complete:");
  console.log(`  User:  ${user.email} / password123`);
  console.log(`  Board: ${board.title} (${board.id})`);
  console.log(`  Lists: To Do, In Progress`);
  console.log(`  Cards: 5`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
