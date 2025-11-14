import { useEffect, useState, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { type AppDispatch, type RootState } from "../app/store";
import { createTask, updateTask } from "../features/tasks/tasksSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectDetails } from "../features/projects/projectsSlice";
import { ChevronDown, Check } from "lucide-react"; //
import { useAlert } from "../context/AlertContext";

const TaskSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  assignees: Yup.string().nullable(),
  status: Yup.string().oneOf(["todo", "in-progress", "in-review", "done"]),
});

const TaskModal = ({ open, onClose, initial, projectId }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { project } = useSelector((s: RootState) => s.projects);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (projectId) dispatch(fetchProjectDetails(projectId));
  }, [projectId, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-[95%] max-w-lg overflow-y-auto max-h-[95vh] custom-scroll">
        <h3 className="text-lg font-semibold mb-3">
          {initial ? "Edit Task" : "Create Task"}
        </h3>
        <Formik
          initialValues={{
            title: initial?.title || "",
            description: initial?.description || "",
            status: initial?.status || "todo",
            assignees:
              Array.isArray(initial?.assignees) && initial.assignees.length > 0
                ? typeof initial.assignees[0] === "string"
                  ? initial.assignees[0]
                  : initial.assignees[0]?._id
                : "",
          }}
          validationSchema={TaskSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const data = {
              ...values,
              project: projectId,
              assignees: values.assignees ? [values.assignees] : [],
            };
            if (initial) {
              const res = await dispatch(
                updateTask({ id: initial._id, data }) as any
              );
              if (res.meta.requestStatus === "fulfilled") {
                showAlert("Task update successful!", "success");
              } else {
                showAlert("Task update failed", "error");
              }
            } else {
              const res = await dispatch(createTask(data) as any);
              if (res.meta.requestStatus === "fulfilled") {
                showAlert("Task create successful!", "success");
              } else {
                showAlert("Task create failed", "error");
              }
            }
            setSubmitting(false);
            onClose();
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <Field
                  name="title"
                  className="w-full border rounded p-2 mt-1"
                />
                {errors.title && touched.title && (
                  <div className="text-red-500 text-sm">{errors.title}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  className="w-full border rounded p-2 mt-1 h-28"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Status</label>
                <Field
                  as="select"
                  name="status"
                  className="w-full border rounded p-2 mt-1"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="in-review">In Review</option>
                  <option value="done">Done</option>
                </Field>
              </div>

              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium mb-1">
                  Assign Member
                </label>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full border rounded p-2 flex justify-between items-center hover:bg-gray-50 transition"
                >
                  {values.assignees
                    ? project?.members.find((m: any) => m._id === values.assignees)
                        ?.name || "Select member"
                    : "Select member"}
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    <div
                      onClick={() => {
                        setFieldValue("assignees", "");
                        setDropdownOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-500"
                    >
                      — No Assignee —
                    </div>

                    {project?.members.length === 0 ? (
                      <p className="text-sm text-gray-500 px-3 py-2">
                        No members found
                      </p>
                    ) : (
                      project?.members.map((m: any) => (
                        <div
                          key={m._id}
                          onClick={() => {
                            setFieldValue("assignees", m._id);
                            setDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-blue-50 ${
                            values.assignees === m._id ? "bg-blue-50" : ""
                          }`}
                        >
                          <span>{m.name}</span>
                          {values.assignees === m._id && (
                            <Check size={16} className="text-blue-600" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded"
                >
                  {initial ? "Update" : "Create"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TaskModal;
