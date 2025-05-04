const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fetchNotes = async (organizationId) => {
  return await prisma.note.findMany({
    where: { organizationId },
  });
};

const addNote = async (organizationId, data) => {
  return await prisma.note.create({
    data: {
      content: data.content,
      entityType: data.entityType,
      entityId: data.entityId,
      organizationId,
    },
  });
};

module.exports = { fetchNotes, addNote };
