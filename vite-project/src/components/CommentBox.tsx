import { useState } from "react";
import { type AppDispatch, type RootState } from "../app/store";
import {
  commentTask,
  editComment,
  deleteComment,
} from "../features/tasks/tasksSlice";
import { useSelector, useDispatch } from "react-redux";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useAlert } from "../context/AlertContext";

const CommentBox = ({ task }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const { showAlert } = useAlert();

  const submit = async () => {
    if (!text.trim()) return;
    await dispatch(commentTask({ id: task._id, text }) as any);
    setText("");
    showAlert(`Comment added successfully!`, "success");
  };

  const handleEdit = async (commentId: string) => {
    if (!editText.trim()) return;
    await dispatch(
      editComment({ taskId: task._id, commentId, text: editText }) as any
    );
    setEditing(null);
    showAlert(`Comment edited successfully!`, "success");
  };

  const handleDelete = async () => {
    if (!selected) return;
    await dispatch(
      deleteComment({ taskId: task._id, commentId: selected }) as any
    );
    setConfirmOpen(false);
    showAlert(`Comment deleted successfully!`, "success");
  };

  return (
    <>
      <div className="mt-3">
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {task.comments?.map((c: any) => (
            <div
              key={c._id}
              className="p-2 rounded bg-gray-50 border border-gray-100"
            >
              <div className="text-xs text-gray-500 mb-1 flex justify-between">
                <span>
                  <span>{c.user?.name || "User"} • </span>
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                </span>
              </div>

              {editing === c._id ? (
                <div className="flex gap-2">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 border rounded p-1 text-sm"
                  />
                  <button
                    onClick={() => handleEdit(c._id)}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="text-gray-600 hover:underline text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-gray-700 text-sm">{c.text}</div>
                  {user?.id === c.user?._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(c._id);
                          setEditText(c.text);
                        }}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(c._id);
                          setConfirmOpen(true);
                        }}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border rounded p-2 text-sm"
          />
          <button
            onClick={submit}
            className="px-3 py-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded text-sm"
          >
            Send
          </button>
        </div>
      </div>
      <ConfirmDeleteModal
        open={confirmOpen}
        title="Delete Comment"
        message="Are you sure you want to delete this comment"
        highlight=""
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default CommentBox;
