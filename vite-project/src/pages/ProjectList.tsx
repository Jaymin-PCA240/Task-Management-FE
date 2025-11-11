import { useEffect, useState } from "react";
import { type AppDispatch, type RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  deleteProject,
} from "../features/projects/projectsSlice";
import ProjectModal from "../components/ProjectModal";

export default function ProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((s: RootState) => s.projects);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => {
    debugger;
    dispatch(fetchProjects() as any);
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Your Projects</h2>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow p-4 flex flex-col"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(p);
                    setOpen(true);
                  }}
                  className="text-sm text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch(deleteProject(p._id) as any)}
                  className="text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <button className="text-sm text-gray-500">Open</button>
            </div>
          </div>
        ))}
      </div>

      <ProjectModal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing}
      />
    </div>
  );
}
