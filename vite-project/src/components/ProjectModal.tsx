import { Formik, Form } from "formik";
import * as Yup from "yup";
import { createProject, updateProject } from "../features/projects/projectsSlice";
import { type AppDispatch } from "../app/store";
import { useDispatch, } from "react-redux";

const schema = Yup.object({
  name: Yup.string().required("Project name required"),
  description: Yup.string().max(600, "Max 600 chars"),
});

export default function ProjectModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: { _id?: string; name?: string; description?: string };
}) {
  const dispatch = useDispatch<AppDispatch>();

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{initial?._id ? "Edit" : "New"} Project</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <Formik
          initialValues={{ name: initial?.name || "", description: initial?.description || "" }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            if (initial?._id) {
              await dispatch(updateProject({ id: initial._id, body: values }) as any);
            } else {
              await dispatch(createProject(values) as any);
            }
            setSubmitting(false);
            onClose();
          }}
        >
          {({ values, handleChange, errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Project name</label>
                <input name="name" value={values.name} onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2" />
                {touched.name && errors.name && <div className="text-sm text-red-500">{errors.name}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea name="description" value={values.description} onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2 h-28" />
                {touched.description && errors.description && <div className="text-sm text-red-500">{errors.description}</div>}
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-md bg-blue-600 text-white">
                  {isSubmitting ? "Saving..." : initial?._id ? "Update" : "Create"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
