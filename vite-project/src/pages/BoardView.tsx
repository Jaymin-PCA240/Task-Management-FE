import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { fetchTasksByProject, moveTask } from "../features/tasks/tasksSlice";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import InviteMemberModal from "../components/InviteMemberModal";
// import ActivityList from "../components/ActivityList";
import { FiPlus } from "react-icons/fi";
import Loader from "../components/Loader";

const BoardView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { items: tasks, loading } = useSelector((s: RootState) => s.tasks);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [openInvite, setOpenInvite] = useState(false);

  useEffect(() => {
    if (projectId) dispatch(fetchTasksByProject(projectId));
  }, [dispatch, projectId]);

  // group tasks by status
  const columns = useMemo(() => {
    return {
      todo: tasks.filter((t) => t.status === "todo"),
      "in-progress": tasks.filter((t) => t.status === "in-progress"),
      "in-review": tasks.filter((t) => t.status === "in-review"),
      done: tasks.filter((t) => t.status === "done"),
    };
  }, [tasks]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as
      | "todo"
      | "in-progress"
      | "in-review"
      | "done";
    await dispatch(moveTask({ id: draggableId, status: newStatus }) as any);
  };

  return (
    <>
      <Loader loading={loading} message="Fetching your data..." size="lg" />
      {!loading && (
        <div className="w-full max-w-[1600px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Board</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setOpenTaskModal(true);
                }}
                className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FiPlus /> Add Task
              </button>
              <button
                onClick={() => setOpenInvite(true)}
                className="px-3 py-2 border rounded-lg bg-gradient-to-r from-green-700 to-green-500 text-white "
              >
                Invite
              </button>
            </div>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(["todo", "in-progress", "in-review", "done"] as const).map(
                (status) => (
                  <Droppable droppableId={status} key={status}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="bg-gray-50 rounded-lg p-4 min-h-[300px] shadow-sm"
                      >
                        <h3 className="font-medium mb-3 capitalize">
                          {status === "todo"
                            ? "To Do"
                            : status === "in-progress"
                            ? "In Progress"
                            : status === "in-review"
                            ? "In Review"
                            : "Done"}
                        </h3>

                        {columns[status].map((task: any, idx: number) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={idx}
                          >
                            {(prov) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className="mb-3"
                              >
                                <TaskCard
                                  task={task}
                                  onEdit={() => {
                                    setEditingTask(task);
                                    setOpenTaskModal(true);
                                  }}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )
              )}
            </div>
          </DragDropContext>
          <TaskModal
            open={openTaskModal}
            initial={editingTask}
            onClose={() => setOpenTaskModal(false)}
            projectId={projectId}
          />
          <InviteMemberModal
            open={openInvite}
            onClose={() => setOpenInvite(false)}
            projectId={projectId}
          />
          <div className="mt-6">
            {/* <ActivityList projectId={projectId} /> */}
          </div>
        </div>
      )}
    </>
  );
};

export default BoardView;
