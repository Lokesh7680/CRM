const { fetchNotes, addNote } = require("./note.service");

const getNotes = async (req, res) => {
  try {
    const notes = await fetchNotes(req.user.organizationId);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createNote = async (req, res) => {
  try {
    const note = await addNote(req.user.organizationId, req.body);
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getNotes, createNote };
