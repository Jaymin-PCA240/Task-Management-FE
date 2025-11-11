import { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { type AppDispatch } from "../app/store";
import { createTask, updateTask } from "../features/tasks/tasksSlice";
import { useDispatch } from "react-redux";

const TaskSchema = Yup.object({
  title: Yup.string().required("Task name is required"),
  description: Yup.string(),
  assignees: Yup.array(),
  status: Yup.string().oneOf(["todo", "in-progress", "done"])
});

const TaskModal = ({ open, onClose, initial, projectId }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {}, []);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-[95%] max-w-lg">
        <h3 className="text-lg font-semibold mb-3">{initial ? "Edit Task" : "Create Task"}</h3>
        <Formik
          initialValues={{
            title: initial?.title || "",
            description: initial?.description || "",
            status: initial?.status || "todo",
            assignees: initial?.assignees?.map((a:any)=>a._id) || []
          }}
          validationSchema={TaskSchema}
          onSubmit={async (values, { setSubmitting }) => {
            if (initial) {
              await dispatch(updateTask({ id: initial._id, data: values }) as any);
            } else {
              await dispatch(createTask({ ...values, project: projectId }) as any);
            }
            setSubmitting(false);
            onClose();
          }}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <Field name="title" className="w-full border rounded p-2 mt-1" />
                {errors.title && touched.title && <div className="text-red-500 text-sm">{errors.title}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <Field as="textarea" name="description" className="w-full border rounded p-2 mt-1 h-28" />
              </div>

              <div>
                <label className="block text-sm font-medium">Status</label>
                <Field as="select" name="status" className="w-full border rounded p-2 mt-1">
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </Field>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded">{initial ? "Update" : "Create"}</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TaskModal;
