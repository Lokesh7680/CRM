// src/pages/Contacts.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { unparse } from "papaparse";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", status: "Active" });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchContacts = async () => {
    try {
      const res = await axios.get("/contacts");
      setContacts(res.data);
    } catch (err) {
      toast.error("Failed to fetch contacts");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/contacts/${editingId}`, form);
        toast.success("Contact updated successfully");
      } else {
        await axios.post("/contacts", form);
        toast.success("Contact added successfully");
      }
      setForm({ name: "", email: "", phone: "", company: "", status: "Active" });
      setEditingId(null);
      fetchContacts();
    } catch (err) {
      toast.error("Error saving contact");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/contacts/${id}`);
      toast.success("Contact deleted successfully");
      fetchContacts();
    } catch (err) {
      toast.error("Error deleting contact");
    }
  };

  const handleEdit = (contact) => {
    setEditingId(contact.id);
    setForm({ name: contact.name, email: contact.email, phone: contact.phone, company: contact.company, status: contact.status });
  };

  const handleExportCSV = () => {
    const filtered = contacts.filter((c) =>
      (statusFilter === "All" || c.status === statusFilter) &&
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length === 0) return toast.info("No contacts to export");

    const csv = unparse(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "contacts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Contacts</h2>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border p-2" required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border p-2" required />
        <input type="text" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border p-2" />
        <input type="text" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full border p-2" />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border p-2">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button type="submit" className={`px-4 py-2 rounded text-white ${editingId ? "bg-green-600" : "bg-blue-600"}`}>
          {editingId ? "Update" : "Add Contact"}
        </button>
      </form>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="mr-2 font-medium">Filter:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border p-2">
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="mr-2 font-medium">Search:</label>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border p-2" placeholder="Enter name" />
        </div>
        <button onClick={handleExportCSV} className="bg-gray-700 text-white px-4 py-2 rounded">Export to CSV</button>
      </div>

      <ul className="space-y-4">
        {contacts
          .filter((c) =>
            (statusFilter === "All" || c.status === statusFilter) &&
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((c) => (
            <li key={c.id} className="border p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm">{c.email}</p>
                  <p className="text-sm">{c.phone}</p>
                  <p className="text-sm">{c.company}</p>
                  <p className="text-sm text-gray-500">{c.status}</p>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(c)} className="text-blue-600">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-600">Delete</button>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Contacts;
