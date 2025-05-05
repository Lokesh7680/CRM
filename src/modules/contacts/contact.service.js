// src/contacts/contact.service.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fetchContacts = async (organizationId) => {
  return await prisma.contact.findMany({
    where: { organizationId },
  });
};

const addContact = async (organizationId, data) => {
  return await prisma.contact.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company || "",  // ✅ Add this
      status: data.status || "Active", // ✅ Add this
      organizationId,
    },
  });
};

const deleteContact = async (id) => {
  return await prisma.contact.delete({
    where: { id },
  });
};

const updateContact = async (id, data) => {
  return await prisma.contact.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
    },
  });
};

const updateContactById = async (id, data) => {
  return await prisma.contact.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      status: data.status
    },
  });
};

const deleteContactById = async (id) => {
  return await prisma.contact.delete({
    where: { id },
  });
};

module.exports = { fetchContacts, addContact, deleteContact, updateContact, updateContactById, deleteContactById };
