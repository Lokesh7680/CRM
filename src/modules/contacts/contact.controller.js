const { fetchContacts, addContact, updateContactById, deleteContactById } = require("./contact.service");

const getContacts = async (req, res) => {
  try {
    const contacts = await fetchContacts(req.user.organizationId);
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createContact = async (req, res) => {
  try {
    const newContact = await addContact(req.user.organizationId, req.body);
    res.status(201).json(newContact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const updated = await updateContactById(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    await deleteContactById(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact
};
