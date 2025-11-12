import { useState } from "react";
import { FiTrash2, FiEdit2, FiMessageSquare } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import CommentBox from "./CommentBox";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { deleteTask } from "../features/tasks/tasksSlice";
import { useAlert } from "../context/AlertContext";
import type { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";

const TaskCard = ({ task, onEdit }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showComments, setShowComments] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const { showAlert } = useAlert();

  const currentUser = useSelector((s: RootState) => s.auth.user);

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    await dispatch(deleteTask(selectedTask._id) as any);
    setConfirmOpen(false);
    showAlert(`Task "${selectedTask.title}" deleted successfully!`, "success");
  };

  return (
    <div className="bg-white rounded-lg p-3 shadow hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{task.title}</h4>
          <p className="text-sm text-gray-500 line-clamp-2">
            {task.description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            {currentUser.id && (
              <>
                {" "}
                <button
                  onClick={onEdit}
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
            <button
              onClick={() => setShowComments((s) => !s)}
              className="text-gray-600 hover:text-blue-600"
            >
              <FiMessageSquare />
            </button>
          </div>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      {showComments && <CommentBox task={task} />}

      <ConfirmDeleteModal
        open={confirmOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task"
        highlight={selectedTask?.title}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
};

export default TaskCard;
