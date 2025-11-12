import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivityLogs, clearActivityLogs } from "../features/activity/activitySlice";
import { type RootState, type AppDispatch } from "../app/store";
import { formatDistanceToNow } from "date-fns";

const ActivityLogModal = ({ open, onClose, projectId }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { logs, loading } = useSelector((s: RootState) => s.activity);

  useEffect(() => {
    if (open && projectId) dispatch(fetchActivityLogs(projectId));
    return () => {
      dispatch(clearActivityLogs());
    };
  }, [open, projectId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-[95%] max-w-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Activity Logs</h3>
          <button
            onClick={() => {
              dispatch(clearActivityLogs());
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40 text-gray-500">
            Loading activities...
          </div>
        ) : logs.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No activity yet</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-100 text-sm font-semibold text-gray-700 px-4 py-2">
              <span>Action</span>
              <span>User</span>
              <span>Time</span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y">
              {logs.map((log: any) => (
                <div
                  key={log._id}
                  className="grid grid-cols-3 px-4 py-3 text-sm hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-800 capitalize">
                    {log.action.replace(/_/g, " ")}
                  </span>
                  <span className="text-gray-700">{log.user?.name || "Unknown"}</span>
                  <span className="text-gray-500 text-right">
                    {formatDistanceToNow(new Date(log.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-5">
          <button
            onClick={() => {
              dispatch(clearActivityLogs());
              onClose();
            }}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogModal;
