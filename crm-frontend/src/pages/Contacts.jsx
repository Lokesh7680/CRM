// src/pages/Contacts.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("/contacts");
      setContacts(res.data);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/contacts", { name, email, phone });
      setContacts((prev) => [...prev, res.data]);
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      console.error("Failed to add contact:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete contact:", err);
    }
  };

  const handleEditSave = async (id) => {
    try {
      const res = await axios.put(`/contacts/${id}`, editForm);
      setContacts((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update contact:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Contacts</h1>

      <form onSubmit={handleAddContact} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Contact
        </button>
      </form>

      {contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <ul className="space-y-2">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className="p-4 bg-white shadow rounded-md border border-gray-200"
            >
              {editingId === contact.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-1 border"
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-1 border"
                  />
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-1 border"
                  />
                  <button
                    type="button"
                    onClick={() => handleEditSave(contact.id)}
                    className="text-green-600 mr-4"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                  <div className="space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(contact.id);
                        setEditForm({ name: contact.name, email: contact.email, phone: contact.phone });
                      }}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Contacts;
