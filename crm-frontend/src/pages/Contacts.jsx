import { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { unparse } from "papaparse";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Active",
  });
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
    setForm({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      status: contact.status,
    });
  };

  const handleExportCSV = () => {
    const filtered = contacts.filter(
      (c) =>
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
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Contacts</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow mb-6"
      >
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Input
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="border rounded p-2"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <Button type="submit" className="w-full md:col-span-2">
          {editingId ? "Update Contact" : "Add Contact"}
        </Button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex items-center gap-2">
          <label className="font-medium">Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded p-2"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium">Search:</label>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter name"
          />
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          Export to CSV
        </Button>
      </div>

      {/* Contact List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {contacts
          .filter(
            (c) =>
              (statusFilter === "All" || c.status === statusFilter) &&
              c.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((c) => (
            <div
              key={c.id}
              className="border rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-1 w-full">
                  <h3 className="text-lg font-semibold text-blue-800 line-clamp-1">{c.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 line-clamp-1">
                    <Mail className="w-4 h-4" /> {c.email}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Phone className="w-4 h-4" /> {c.phone}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-1">{c.company}</p>
                  <span
                    className={`inline-block mt-1 text-xs font-medium px-2 py-1 rounded ${
                      c.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600 hover:underline text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Contacts;
