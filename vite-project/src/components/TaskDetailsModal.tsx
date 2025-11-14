import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import CommentBox from "./CommentBox";

const TaskDetailsModal = ({ open, onClose, selectedTask }: any) => {
  const { loading } = useSelector((s: RootState) => s.tasks);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg p-6 relative max-h-[80vh] overflow-y-auto custom-scroll">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-5 top-5 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin border-4 border-blue-600 border-t-transparent w-10 h-10 rounded-full"></div>
          </div>
        ) : (
          selectedTask && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {selectedTask.title}
                </h2>
                <p className="text-sm text-gray-500">
                  Created on{" "}
                  {new Date(selectedTask.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Description
                </h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedTask.description || "No description provided"}
                </p>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Status
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedTask.status === "done"
                      ? "bg-green-100 text-green-700"
                      : selectedTask.status === "in-progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {selectedTask.status.replace("-", " ").toUpperCase()}
                </span>
              </div>

              {/* Assigned Member */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Assigned Member
                </h3>
                {selectedTask.assignees && selectedTask.assignees.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.assignees.map((m: any) => (
                      <div
                        key={m._id}
                        className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-1"
                      >
                        <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
                          {m.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-700">{m.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No members assigned</p>
                )}
              </div>

              {/* Comments */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Comments
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 max-h-55 overflow-y-auto">
                  <CommentBox task={selectedTask} />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;
