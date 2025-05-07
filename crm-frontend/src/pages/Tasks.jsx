// src/pages/Tasks.jsx
import { useState, useEffect } from "react";
import axios from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Tasks = () => {
  const [orgId, setOrgId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [filterPriority, setFilterPriority] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    reminderTime: "",
    priority: "Medium",
    status: "Pending",
    completed: false,
    organizationId: "",
    createdBy: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const orgId = payload.organizationId;
      const email = payload.email;

      setOrgId(orgId);

      setForm((prev) => ({
        ...prev,
        organizationId: orgId,
        createdBy: email,
      }));

      fetchTasks(orgId);
    } catch (err) {
      console.error("Token decode error:", err);
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      tasks.forEach((task) => {
        if (
          task.reminderTime &&
          new Date(task.reminderTime) <= now &&
          !task.notified
        ) {
          toast.info(`⏰ Reminder: ${task.title}`, {
            position: "top-right",
            autoClose: 5000,
          });
          const audio = new Audio("https://www.soundjay.com/button/beep-07.mp3");
          audio.play();          
          task.notified = true;
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  const fetchTasks = async (orgId) => {
    try {
      const res = await axios.get(`/tasks/org/${orgId}`);
      const allTasks = res.data;
      setTasks(allTasks);
      setPendingTasks(allTasks.filter((t) => t.status !== "Completed"));
      setCompletedTasks(allTasks.filter((t) => t.status === "Completed"));
    } catch (err) {
      console.error("Failed to fetch tasks:", err.response?.data || err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toUTC = (localStr) => new Date(localStr).toISOString();

    const payload = {
      ...form,
      dueDate: toUTC(form.dueDate),
      reminderTime: form.reminderTime ? toUTC(form.reminderTime) : null,
    };

    await axios.post("/tasks", payload);
    fetchTasks(orgId);

    setForm({
      title: "",
      description: "",
      dueDate: "",
      reminderTime: "",
      priority: "Medium",
      status: "Pending",
      completed: false,
      organizationId: orgId,
      createdBy: form.createdBy,
    });
  };

  const exportTasksToCSV = (taskList) => {
    const csvRows = [
      ["Title", "Description", "Due Date", "Priority", "Status"],
      ...taskList.map(task => [
        `"${task.title}"`,
        `"${task.description}"`,
        `"${new Date(task.dueDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }).replace(',', '')}"`,
        `"${task.priority}"`,
        `"${task.status}"`
      ]),
    ];
  
    const blob = new Blob(
      [csvRows.map(row => row.join(",")).join("\n")],
      { type: "text/csv" }
    );
  
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "tasks.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
    

  const filteredPending = pendingTasks.filter(
    (t) =>
      (!filterPriority || t.priority === filterPriority) &&
      (!filterDate || t.dueDate.startsWith(filterDate))
  );

  const filteredCompleted = completedTasks.filter(
    (t) =>
      (!filterPriority || t.priority === filterPriority) &&
      (!filterDate || t.dueDate.startsWith(filterDate))
  );

  const chartData = [
    { name: "Pending", value: pendingTasks.length },
    { name: "Completed", value: completedTasks.length },
  ];

  const COLORS = ["#facc15", "#4ade80"];

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">Task Manager</h2>

      <button
        onClick={() => exportTasksToCSV(tasks)}
        className="bg-green-700 text-white px-4 py-2 rounded mb-4"
      >
        Export All Tasks to CSV
      </button>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="border p-2 w-full" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 w-full" />
        <input type="datetime-local" name="dueDate" value={form.dueDate} onChange={handleChange} required className="border p-2 w-full" />
        <input type="datetime-local" name="reminderTime" value={form.reminderTime} onChange={handleChange} className="border p-2 w-full" />
        <select name="priority" value={form.priority} onChange={handleChange} className="border p-2 w-full">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Task</button>
      </form>

      <div className="flex gap-4 mb-6">
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="border p-1">
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="border p-1" />
      </div>

      <PieChart width={300} height={200} className="mb-8">
        <Pie
          data={chartData}
          cx={150}
          cy={100}
          labelLine={false}
          outerRadius={80}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <h3 className="text-lg font-semibold mt-6">🟡 Pending Tasks</h3>
      <div className="space-y-4">
        {filteredPending.map((task) => (
          <TaskCard key={task.id} task={task} refresh={() => fetchTasks(orgId)} />
        ))}
      </div>

      <h3 className="text-lg font-semibold mt-10">✅ Completed Tasks</h3>
      <div className="space-y-4">
        {filteredCompleted.map((task) => (
          <TaskCard key={task.id} task={task} refresh={() => fetchTasks(orgId)} />
        ))}
      </div>
    </div>
  );
};

const TaskCard = ({ task, refresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "Completed";

  const handleChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    const payload = {
      ...editedTask,
      dueDate: new Date(editedTask.dueDate).toISOString(),
      reminderTime: editedTask.reminderTime ? new Date(editedTask.reminderTime).toISOString() : null,
    };
    await axios.put(`/tasks/${task.id}`, payload);
    setIsEditing(false);
    refresh();
  };
  
  const handleDelete = async () => {
    if (window.confirm("Delete this task?")) {
      await axios.delete(`/tasks/${task.id}`);
      refresh();
    }
  };

  return (
    <div className={`border p-4 rounded shadow ${isOverdue ? "bg-red-100 border-red-400" : ""}`}>
      {isEditing ? (
        <>
          <input name="title" value={editedTask.title} onChange={handleChange} className="border p-1 w-full mb-2" />
          <textarea name="description" value={editedTask.description} onChange={handleChange} className="border p-1 w-full mb-2" />
          <input type="datetime-local" name="dueDate" value={editedTask.dueDate?.slice(0, 16)} onChange={handleChange} className="border p-1 w-full mb-2" />
          <input type="datetime-local" name="reminderTime" value={editedTask.reminderTime?.slice(0, 16)} onChange={handleChange} className="border p-1 w-full mb-2" />
          <select name="status" value={editedTask.status} onChange={handleChange} className="border p-1 w-full mb-2">
            <option>Pending</option>
            <option>Completed</option>
          </select>
          <button onClick={saveChanges} className="bg-green-600 text-white px-3 py-1 rounded mr-2">Save</button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
        </>
      ) : (
        <>
          <div className="flex justify-between">
            <h3 className="font-semibold">{task.title}</h3>
            <span className="text-sm text-gray-500">{task.priority}</span>
          </div>
          <p className="text-sm">{task.description}</p>
          <p className="text-sm text-gray-600">Due: {new Date(task.dueDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          {task.reminderTime && (
            <p className="text-sm text-orange-500">Reminder: {new Date(task.reminderTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          )}
          <div className="mt-2 flex gap-2">
            <button onClick={() => setIsEditing(true)} className="text-sm bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
            <button onClick={handleDelete} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Tasks;
