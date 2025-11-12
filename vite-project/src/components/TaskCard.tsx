import { useState } from "react";
import { FiTrash2, FiEdit2, FiMessageSquare } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import CommentBox from "./CommentBox";

const TaskCard = ({ task, onEdit, onDelete }: any) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white rounded-lg p-3 shadow hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{task.title}</h4>
          <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button onClick={onEdit} className="text-gray-600 hover:text-blue-600"><FiEdit2 /></button>
            <button onClick={onDelete} className="text-gray-600 hover:text-red-600"><FiTrash2 /></button>
            <button onClick={() => setShowComments(s => !s)} className="text-gray-600 hover:text-blue-600"><FiMessageSquare /></button>
          </div>
          <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      {showComments && <CommentBox task={task} />}
    </div>
  );
};

export default TaskCard;
