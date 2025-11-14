import { useState } from "react";
import { FiTrash2, FiEdit2, FiMessageSquare } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import CommentBox from "./CommentBox";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { deleteTask } from "../features/tasks/tasksSlice";
import { useAlert } from "../context/AlertContext";
import type { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import TaskDetailsModal from "./TaskDetailsModal";

const TaskCard = ({ task, onEdit }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [openTask, setOpenTask] = useState(false);
  const { showAlert } = useAlert();

  const currentUser = useSelector((s: RootState) => s.auth.user);

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    await dispatch(deleteTask(selectedTask._id) as any);
    setConfirmOpen(false);
    showAlert(`Task "${selectedTask.title}" deleted successfully!`, "success");
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setOpenTask(true);
      }}
      className="bg-white rounded-lg p-3 shadow hover:shadow-md transition"
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{task.title}</h4>
          <p className="text-sm text-gray-500 line-clamp-2">
            {task.description}
          </p>
          <div className="flex items-center gap-1 mt-3">
            {task.assignees && task.assignees.length > 0 ? (
              task.assignees.map((user: any) => (
                <div
                  key={user._id}
                  title={user.name}
                  className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white flex items-center justify-center text-sm font-semibold"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              ))
            ) : (
              <span className="text-xs text-gray-400">No assignees</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            {currentUser.id === task.project.owner && (
              <>
                {" "}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="text-gray-600 hover:text-blue-600"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTask(task);
                    setConfirmOpen(true);
                  }}
                  className="text-gray-600 hover:text-red-600"
                >
                  <FiTrash2 />
                </button>{" "}
              </>
            )}
          </div>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      <ConfirmDeleteModal
        open={confirmOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task"
        highlight={selectedTask?.title}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDeleteTask}
      />
      <TaskDetailsModal
        open={openTask}
        onClose={() => {
          setOpenTask(false);
        }}
        selectedTask={task}
      />
    </div>
  );
};

export default TaskCard;
