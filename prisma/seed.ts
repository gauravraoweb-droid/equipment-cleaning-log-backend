import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const eq1 = await prisma.equipment.create({
    data: {
      name: "Reactor V-101",
      code: "REAC-101",
      status: "ACTIVE",
    },
  });

  const eq2 = await prisma.equipment.create({
    data: {
      name: "Centrifuge C-200",
      code: "CENT-200",
      status: "ACTIVE",
    },
  });

  await prisma.cleaningRecord.create({
    data: {
      equipmentId: eq1.id,
      cleanedBy: "John Doe",
      cleanedAt: new Date(),
      method: "CIP with NaOH",
      notes: "Rinse twice",
      status: "PENDING",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });