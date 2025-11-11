import { useState } from "react";
import { type AppDispatch } from "../app/store";
import { commentTask } from "../features/tasks/tasksSlice";
import { useDispatch } from "react-redux";

const CommentBox = ({ task }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [text, setText] = useState("");

  const submit = async () => {
    if (!text.trim()) return;
    await dispatch(commentTask({ id: task._id, text }) as any);
    setText("");
  };

  return (
    <div className="mt-3">
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {task.comments?.map((c: any) => (
          <div key={c._id} className="text-sm p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">{c.user?.name || "User"} • {new Date(c.createdAt).toLocaleString()}</div>
            <div className="text-gray-700">{c.text}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Write a comment..." className="flex-1 border rounded p-2" />
        <button onClick={submit} className="px-3 py-2 bg-blue-600 text-white rounded">Send</button>
      </div>
    </div>
  );
};

export default CommentBox;
