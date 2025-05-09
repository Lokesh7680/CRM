// src/pages/EmailTemplates.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Card from "@/components/ui/Card";
import { Eye, Trash2, BarChart2, Copy, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState("");
  const [mjml, setMjml] = useState("");
  const [htmlPreview, setHtmlPreview] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editId, setEditId] = useState(null);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get("/templates");
      setTemplates(res.data);
    } catch (err) {
      console.error("Error fetching templates:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/templates/${editId}`, { name, mjml });
        toast.success("Template updated");
      } else {
        await axios.post("/templates", { name, mjml });
        toast.success("Template saved");
      }
      setName("");
      setMjml("");
      setEditId(null);
      fetchTemplates();
    } catch (err) {
      toast.error("Failed to save template");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/templates/${id}`);
      fetchTemplates();
      toast.success("Deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handlePreview = async (mjml) => {
    try {
      const res = await axios.post("/templates/render", { mjml });
      setHtmlPreview(res.data.html);
    } catch {
      toast.error("Failed to render MJML");
    }
  };

  const handleCopy = (mjml) => {
    navigator.clipboard.writeText(mjml);
    toast.info("MJML copied");
  };

  const handleEdit = (template) => {
    setEditId(template.id);
    setName(template.name);
    setMjml(template.mjml);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">Email Templates</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <Input label="Template Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea
          placeholder="Paste MJML here"
          value={mjml}
          onChange={(e) => setMjml(e.target.value)}
          rows={8}
          className="border p-2 rounded"
          required
        />
        <Button type="submit">{editId ? "Update Template" : "Save Template"}</Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((t) => (
<Card key={t.id} className="p-4 rounded-2xl border shadow-sm hover:shadow-lg transition-all">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    {/* Left: Title + Snippet */}
    <div className="flex-1">
      <h4 className="text-lg font-semibold text-gray-900">{t.name}</h4>
      <p className="text-sm text-gray-500 line-clamp-2">{t.mjml}</p>
    </div>

    {/* Right: Actions */}
    <div className="flex flex-wrap items-center gap-2 justify-end">
      <Button size="icon" variant="outline" onClick={() => handlePreview(t.mjml)} title="Preview">
        <Eye className="w-4 h-4" />
      </Button>
      <Button size="icon" variant="outline" onClick={() => handleCopy(t.mjml)} title="Copy">
        <Copy className="w-4 h-4" />
      </Button>
      <Button size="icon" variant="outline" onClick={() => handleEdit(t)} title="Edit">
        <Pencil className="w-4 h-4" />
      </Button>
      <Link to={`/analytics/template/${t.id}`} title="Analytics">
        <Button size="icon" variant="outline">
          <BarChart2 className="w-4 h-4" />
        </Button>
      </Link>
      <Button
        size="icon"
        variant="destructive"
        onClick={() => handleDelete(t.id)}
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </div>
</Card>
        ))}
      </div>

      {htmlPreview && (
        <div className="bg-white rounded shadow p-4 mt-6">
          <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
          <div dangerouslySetInnerHTML={{ __html: htmlPreview }} />
        </div>
      )}
    </div>
  );
};

export default EmailTemplates;
