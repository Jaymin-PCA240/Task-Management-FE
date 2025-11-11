import React from "react";
import { Formik, Form, Field } from "formik";
import api from "../api/axiosInstance";
import * as Yup from "yup";

const InviteSchema = Yup.object({ email: Yup.string().email("Invalid email").required("Email is Required") });

const InviteMemberModal = ({ open, onClose, projectId }: any) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-[95%] max-w-md">
        <h3 className="text-lg font-semibold mb-3">Invite Member</h3>
        <Formik initialValues={{ email: "" }} validationSchema={InviteSchema} onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await api.post(`/projects/${projectId}/invite`, { email: values.email });
            // show success (you may use toast)
            resetForm();
            onClose();
          } catch (err) {
            // show error
          } finally { setSubmitting(false); }
        }}>
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <Field name="email" placeholder="member@example.com" className="w-full border rounded p-2" />
                {errors.email && touched.email && <div className="text-red-500 text-sm">{errors.email}</div>}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Invite</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default InviteMemberModal;
