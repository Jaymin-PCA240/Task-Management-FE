import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import type { AppDispatch, RootState } from "../app/store";
import { updateProfile } from "../features/auth/authSlice";
import { useAlert } from "../context/AlertContext";

const ProfileSchema = Yup.object({
  name: Yup.string().required("Name is required"),
});

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  ;
  const { user } = useSelector((s: RootState) => s.auth);
  const { showAlert } = useAlert();

  return (
    <div className="w-full max-w-[1600px]">
      <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-5 text-gray-800">My Profile</h2>

        <Formik
          initialValues={{ name: user.name }}
          validationSchema={ProfileSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const res = await dispatch(updateProfile(values));
            if (res.meta.requestStatus === "fulfilled") {
              showAlert("Profile updated successfully!", "success");
            } else {
              showAlert("Profile update failed", "error");
            }
            setSubmitting(false);
          }}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Name
                </label>
                <Field
                  name="name"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-100"
                />
                {errors.name && touched.name && (
                  <div className="text-sm text-red-500 mt-1">{errors.name}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  value={user.email}
                  readOnly
                  className="w-full border border-gray-300 bg-gray-100 rounded-lg p-2 text-gray-600"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2 rounded-lg shadow hover:opacity-90"
                >
                  {isSubmitting ? "Saving..." : "Update Profile"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProfilePage;
