import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import {
  fetchProjects,
  deleteProject,
} from "../features/projects/projectsSlice";
import ProjectModal from "../components/ProjectModal";
import { format } from "date-fns";
import { FiEdit2, FiTrash2, FiFolder } from "react-icons/fi";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAlert } from "../context/AlertContext";
import { generatePath, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function ProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading } = useSelector((s: RootState) => s.projects);
  const currentUser = useSelector((s: RootState) => s.auth.user);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!selected) return;
    await dispatch(deleteProject(selected._id) as any);
    setConfirmOpen(false);
    showAlert(`Project "${selected.name}" deleted successfully!`, "success");
  };

  return (
    <>
      <Loader loading={loading} message="Fetching your data..." size="lg" />
      {!loading && (
        <div className="w-full max-w-[1600px]">
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl text-white py-10 px-8 mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Projects</h1>
            <p className="text-white/90">
              Organize and manage your projects with your team.
            </p>
            <button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
              className="mt-6 bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              + Create Project
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.length === 0 && (
              <p className="text-gray-500 col-span-full text-center">
                No projects found.
              </p>
            )}

            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white shadow-md rounded-xl p-5 flex flex-col hover:shadow-lg transition-all cursor-pointer"
                onClick={() =>
                  navigate(
                    generatePath("/projects/:projectId/board", {
                      projectId: project._id,
                    })
                  )
                }
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <FiFolder className="text-blue-600 text-lg" />
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                  </div>
                  {currentUser.id == project?.owner?._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditing(project);
                          setOpen(true);
                        }}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(project);
                          setConfirmOpen(true);
                        }}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {project.description}
                </p>

                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>👤 {project?.owner?.name || "Unknown"}</span>
                  <span>
                    {format(new Date(project.createdAt ?? ""), "MMM dd, yyyy")}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span>
                      👥
                    </span>
                    <span className="font-medium">
                      {project.members?.length || 0} Member
                      {project.members?.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ProjectModal
            open={open}
            onClose={() => setOpen(false)}
            initial={editing}
          />

          <ConfirmDeleteModal
            open={confirmOpen}
            title="Delete Project"
            message="Are you sure you want to delete this project"
            highlight={selected?.name}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={handleDelete}
          />
        </div>
      )}
    </>
  );
}
