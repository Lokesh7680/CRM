import { useEffect, useState } from "react";
import axios from "../api/axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Badge from "@/components/ui/Badge"; // ✅ Correct
import { Button } from "@/components/ui/button";
import { Tooltip } from "react-tooltip";

const TaskCalendar = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("calendar");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const orgId = payload.organizationId;
        const res = await axios.get(`/tasks/org/${orgId}`);

        const mapped = res.data.map((t) => ({
          id: t.id,
          title: `${t.title}`,
          start: t.dueDate,
          extendedProps: {
            description: t.description,
            priority: t.priority,
            status: t.status,
            reminderTime: t.reminderTime,
          },
        }));

        setEvents(mapped);
      } catch (err) {
        console.error("Error loading tasks", err);
      }
    };

    fetchTasks();
  }, []);

  const renderTooltipContent = (info) => {
    const props = info.event.extendedProps;
    return `
      <div class="p-2 text-sm">
        <strong>${info.event.title}</strong><br/>
        <span>Status: ${props.status}</span><br/>
        <span>Priority: ${props.priority}</span><br/>
        ${props.description ? `<span>Description: ${props.description}</span><br/>` : ""}
        ${props.reminderTime ? `<span>Reminder: ${new Date(props.reminderTime).toLocaleString()}</span>` : ""}
      </div>`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Task Calendar</h2>
        <Button onClick={() => setView(view === "calendar" ? "list" : "calendar")}>{view === "calendar" ? "List View" : "Calendar View"}</Button>
      </div>

      {view === "calendar" ? (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventDidMount={(info) => {
            const tooltip = document.createElement("div");
            tooltip.innerHTML = renderTooltipContent(info);
            tooltip.className = "z-50 bg-white shadow-md border p-2 rounded text-sm w-60";
            document.body.appendChild(tooltip);
            const mouseEnterHandler = (e) => {
              tooltip.style.left = e.pageX + 10 + "px";
              tooltip.style.top = e.pageY + 10 + "px";
              tooltip.style.position = "absolute";
              tooltip.style.display = "block";
            };
            const mouseLeaveHandler = () => {
              tooltip.remove();
            };
            info.el.addEventListener("mouseenter", mouseEnterHandler);
            info.el.addEventListener("mousemove", mouseEnterHandler);
            info.el.addEventListener("mouseleave", mouseLeaveHandler);
          }}
          height={650}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {events.map((e) => (
            <div key={e.id} className="p-4 border shadow rounded">
              <h3 className="font-semibold text-lg">{e.title}</h3>
              <p className="text-sm">Due: {new Date(e.start).toLocaleString()}</p>
              <Badge label={e.extendedProps.priority} />
              <p className="text-sm text-gray-600">{e.extendedProps.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskCalendar;
