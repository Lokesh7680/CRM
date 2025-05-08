// src/pages/OpportunitiesBoard.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import clsx from "clsx";
import { toast } from "react-toastify";

const stages = [
  "Prospecting",
  "Proposal Sent",
  "Negotiation",
  "Closed Won",
  "Closed Lost"
];

const OpportunitiesBoard = () => {
  const [opps, setOpps] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await axios.get("/opportunities");
      setOpps(res.data);
    } catch {
      console.log("Error loading opportunities");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const grouped = stages.map(stage => ({
    stage,
    items: opps.filter(o => o.status === stage)
  }));

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const draggedOpportunity = opps.find(o => o.id === draggableId);
    if (!draggedOpportunity) return;

    try {
      await axios.put(`/opportunities/${draggableId}`, {
        ...draggedOpportunity,
        status: destination.droppableId
      });
      fetchData();
      toast.success(`Moved to ${destination.droppableId}`);
    } catch {
      console.error("Failed to update status");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-700">Opportunities Pipeline</h2>
        <Button variant="outline" onClick={() => navigate("/opportunities")}>⬅ Back</Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto">
          {grouped.map((col) => (
            <Droppable droppableId={col.stage} key={col.stage}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={clsx(
                    "bg-white rounded-xl shadow p-3 min-h-[300px]",
                    snapshot.isDraggingOver ? "bg-blue-50" : ""
                  )}
                >
                  <h3 className="text-lg font-semibold text-blue-600 mb-2 border-b pb-1">{col.stage}</h3>
                  <div className="space-y-2">
                    {col.items.map((opp, index) => (
                      <Draggable draggableId={opp.id} index={index} key={opp.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={clsx(
                              "p-3 rounded-md border bg-white shadow-sm",
                              snapshot.isDragging
                                ? "ring-2 ring-blue-300 shadow-md z-50"
                                : "hover:bg-gray-50 transition-colors duration-150"
                            )}
                          >
                            <p className="font-medium text-blue-800 line-clamp-1">{opp.title}</p>
                            <p className="text-sm text-gray-600 line-clamp-1">${opp.value}</p>
                            <p className="text-xs text-gray-400">{opp.closeDate?.split("T")[0]}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {col.items.length === 0 && (
                      <p className="text-sm text-gray-400 italic">No items</p>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default OpportunitiesBoard;