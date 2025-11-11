import { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { fetchTasksByProject, moveTask } from "../features/tasks/tasksSlice";
import { type AppDispatch, type RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "review", title: "In Review" },
  { id: "done", title: "Completed" },
];

export default function TaskBoard({ projectId }: { projectId: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((s : RootState) => s.tasks.byProject[projectId] || []);

  useEffect(() => { dispatch(fetchTasksByProject(projectId) as any); }, [dispatch, projectId]);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const destStatus = destination.droppableId as any;
    await dispatch(moveTask({ id: draggableId, status: destStatus }) as any);
  };

  // group tasks by status
  const grouped: Record<string, typeof tasks> = { todo: [], inprogress: [], review: [], done: [] };
  tasks.forEach((t) => (grouped[t.status] = grouped[t.status] || []).push(t));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col) => (
          <Droppable droppableId={col.id} key={col.id}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="bg-white rounded-lg p-4 min-h-[200px]">
                <h4 className="font-semibold mb-2">{col.title}</h4>
                {grouped[col.id].map((task: any, index: number) => (
                  <Draggable draggableId={task._id} index={index} key={task._id}>
                    {(dr) => (
                      <div ref={dr.innerRef} {...dr.draggableProps} {...dr.dragHandleProps} className="bg-gray-50 p-3 rounded-md mb-3 shadow">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-gray-500">{task.assignee?.name || "Unassigned"}</div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
