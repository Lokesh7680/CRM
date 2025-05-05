import { useEffect, useState } from "react";
import axios from "../api/axios";
import mjml2html from "mjml-browser";

const EmailTemplates = () => {
  const [name, setName] = useState("");
  const [mjml, setMjml] = useState("");
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState(null);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get("/templates");
      setTemplates(res.data);
    } catch (err) {
      console.error("Error fetching templates:", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/templates", { name, mjml });
      setName("");
      setMjml("");
      fetchTemplates();
    } catch (err) {
      console.error("Error saving template:", err);
    }
  };

  const handleSendTest = async (template) => {
    try {
      setSendingId(template.id);
  
      // Convert MJML to HTML
      const rendered = mjml2html(template.mjml);
      const html = rendered.html;
  
      await axios.post("/queue-email", {
        emails: [
          {
            to: "sanjuramshetty@gmail.com", // ✅ Replace with your email
            subject: `Test Email: ${template.name}`,
            campaignId: template.id,
            html, // Sending HTML body
          },
        ],
      });
  
      alert("Test email queued successfully!");
    } catch (err) {
      console.error("Error sending test email:", err);
      alert("Failed to queue email.");
    } finally {
      setSendingId(null);
    }
  };
  

  useEffect(() => {
    fetchTemplates();
  }, []);

  let renderedHtml = "";
  try {
    renderedHtml = mjml ? mjml2html(mjml).html : "";
  } catch (err) {
    renderedHtml = "<p class='text-red-600'>⚠️ MJML parsing error.</p>";
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📨 Email Templates</h2>

      <form onSubmit={handleSave} className="space-y-4 mb-8 bg-gray-100 p-6 rounded shadow">
        <input
          type="text"
          placeholder="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          required
        />

        <textarea
          placeholder="<mjml>...</mjml>"
          value={mjml}
          onChange={(e) => setMjml(e.target.value)}
          rows={10}
          className="border border-gray-300 p-2 rounded w-full font-mono"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Save Template
        </button>
      </form>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
        <div
          className="border rounded p-4 bg-white shadow"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">📁 Saved Templates</h3>
        <ul className="space-y-4">
          {templates.map((t) => (
            <li key={t.id} className="border p-4 rounded shadow bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800">{t.name}</span>
                <button
                  onClick={() => handleSendTest(t)}
                  disabled={sendingId === t.id}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  {sendingId === t.id ? "Sending..." : "Send Test Email"}
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-gray-600 bg-gray-100 p-2 rounded">
                {t.mjml}
              </pre>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmailTemplates;
