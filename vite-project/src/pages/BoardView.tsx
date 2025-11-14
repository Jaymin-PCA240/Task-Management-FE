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
import Loader from "../components/Loader";
import ActivityLogModal from "../components/ActivityLogModal";
import ProjectMembersModal from "../components/ProjectMembersModal";

const BoardView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { items: tasks, loading } = useSelector((s: RootState) => s.tasks);
  const { user } = useSelector((state: RootState) => state.auth);
  const { project, loading: loading2 } = useSelector(
    (s: RootState) => s.projects
  );
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [openInvite, setOpenInvite] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [openMembers, setOpenMembers] = useState(false);

  useEffect(() => {
    if (projectId) dispatch(fetchTasksByProject(projectId));
  }, [dispatch, projectId]);

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
      {loading ? (
        <Loader
          loading={loading || loading2}
          message="Fetching your data..."
          size="lg"
        />
      ) : (
        <>
          <div className="w-full max-w-[1600px]">
            <div className="md:flex justify-between bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl text-white py-6 px-8 mb-4">
              <div className="mb-2 md:mb-0">
                <h1 className="text-3xl font-bold mb-2">{project?.name}</h1>
                <p className="text-white/90">{project?.description}</p>
              </div>
              <div className="flex items-center">
                {user.id === project?.owner?._id && (
                  <>
                    <button
                      onClick={() => {
                        setEditingTask(null);
                        setOpenTaskModal(true);
                      }}
                      className=" bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                    >
                      + Create Task
                    </button>
                    <button
                      onClick={() => setOpenInvite(true)}
                      className="bg-gradient-to-r from-green-700 to-green-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition mr-2 ml-2"
                    >
                      Invite
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowActivity(true)}
                  className="bg-gradient-to-r from-orange-700 to-orange-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  View Activity
                </button>
                <div
                  className="flex -space-x-3 ml-2 cursor-pointer"
                  onClick={() => setOpenMembers(true)}
                >
                  {project?.members?.slice(0, 3)?.map((m: any) => (
                    <div
                      key={m._id}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-white to-white text-gray-700 flex items-center justify-center text-sm font-semibold"
                    >
                      {m.name?.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {project?.members?.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center text-sm font-semibold">
                      +{project?.members?.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          </div>
          <ActivityLogModal
            open={showActivity}
            onClose={() => setShowActivity(false)}
            projectId={projectId}
          />
          <ProjectMembersModal
            open={openMembers}
            onClose={() => setOpenMembers(false)}
            projectId={projectId}
          />
        </>
      )}
    </>
  );
};

export default BoardView;
