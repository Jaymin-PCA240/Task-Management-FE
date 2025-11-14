import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import {
  fetchProjectDetails,
  removeProjectMember,
} from "../features/projects/projectsSlice";
import { FaUserCircle } from "react-icons/fa";
import { useAlert } from "../context/AlertContext";
import Loader from "../components/Loader";

const ProjectMembersModal = ({ open, onClose, projectId }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { showAlert } = useAlert();
  const { project, loading } = useSelector(
    (state: RootState) => state.projects
  );
  const currentUser = useSelector((s: RootState) => s.auth.user);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Project Members</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y">
          {loading ? (
            <Loader loading={loading} message="Fetching your data..." size="lg"/>
          ) : project?.members?.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm text-center">
              No members found
            </p>
          ) : (
            project?.members?.map((m: any) => (
              <div
                key={m._id}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <FaUserCircle className="text-blue-600 text-2xl" />
                  <div>
                    <p className="font-medium text-gray-800">{m.name}</p>
                    <p className="text-sm text-gray-500">{m.email}</p>
                  </div>
                </div>
                {!(project.owner._id === m._id) && (currentUser.id === project.owner._id) && (
                  <button
                    onClick={async () => {
                      const res = await dispatch(
                        removeProjectMember({ projectId, memberId: m._id })
                      );
                      if (res.meta.requestStatus === "fulfilled") {
                        await dispatch(fetchProjectDetails(projectId));
                        showAlert("Member removed successfully!", "success");
                      } else {
                        showAlert("Remove member failed", "error");
                      }
                    }}
                    className="bg-gradient-to-r from-red-700 to-red-500 px-2 py-2 text-white rounded text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectMembersModal;
