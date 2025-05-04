const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: { name: "Akshaya Aerospace" },
    update: {},
    create: { name: "Akshaya Aerospace" },
  });

  const existingUser = await prisma.user.findUnique({
    where: { email: "lokeshreddyneelapu@gmail.com" },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await prisma.user.create({
      data: {
        email: "lokeshreddyneelapu@gmail.com",
        password: hashedPassword,
        name: "Lokesh Reddy Neelapu",
        role: "ADMIN",
        organizationId: org.id,
      },
    });

    console.log("User seeded successfully.");
  } else {
    console.log("User already exists.");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
