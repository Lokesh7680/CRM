const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../utils/jwt");

const prisma = new PrismaClient();

const signup = async ({ email, password, name, role, orgName }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("User already exists");

  const org = await prisma.organization.create({
    data: { name: orgName },
  });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
      organizationId: org.id,
    },
  });

  const token = generateToken(user);
  return { token, user };
};

const login = async ({ email, password }) => {
  console.log(email, password)
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log("User not found for email:", email); // 👈 Debug log
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("Password mismatch for:", email); // 👈 Debug log
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
      createdAt: user.createdAt,
    },
  };
};

module.exports = { signup, login };
