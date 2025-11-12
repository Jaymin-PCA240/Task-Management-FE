import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FiSearch } from "react-icons/fi";
import {
  inviteMember,
  searchUsersToInvite,
} from "../features/projects/projectsSlice";
import type { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "../context/AlertContext";

const InviteSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is Required"),
});

const InviteMemberModal = ({ open, onClose, projectId }: any) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const { showAlert } = useAlert();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((s: RootState) => s.projects);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) fetchUsers(search);
      else setUsers([]);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchUsers = async (query: string) => {
    const res = await dispatch(searchUsersToInvite({ projectId, query }));
    if (res.meta.requestStatus === "fulfilled") {
      setUsers(res.payload || []);
    }
  };

  const handleInvite = async (
    email: string,
    resetForm: any,
    setSubmitting: any
  ) => {
    const res = await dispatch(inviteMember({ projectId, email }));
    if (res.meta.requestStatus === "fulfilled") {
      onClose();
      resetForm();
      setSubmitting(false);
      setSearch("");
      showAlert("Member invited successfully", "success");
    } else {
      showAlert(res.payload, "error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-[95%] max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Invite Member</h3>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={InviteSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            await handleInvite(values.email, resetForm, setSubmitting);
          }}
        >
          {({ errors, touched, setFieldValue, setSubmitting, resetForm }) => (
            <Form className="space-y-4">
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-gray-500">
                  <FiSearch size={18} />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="pl-9 w-full border rounded-lg p-2 focus:ring focus:ring-blue-100"
                />
              </div>

              {/* User List */}
              {loading && <p className="text-gray-500 text-sm">Searching...</p>}
              {!loading && search && (
                <div className="border rounded-lg max-h-56 overflow-y-auto divide-y">
                  {users.length === 0 ? (
                    <p className="text-sm text-gray-500 p-2 text-center">
                      No users found
                    </p>
                  ) : (
                    users.map((u) => (
                      <div
                        key={u._id}
                        className="flex justify-between items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setFieldValue("email", u.email);
                          setSearch(u.email);
                          setUsers([]);
                        }}
                      >
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-sm text-gray-500">{u.email}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleInvite(u.email, resetForm, setSubmitting)
                          }
                          className="bg-gradient-to-r from-blue-700 to-blue-500 text-white  text-sm px-3 py-1 rounded hover:bg-blue-400"
                        >
                          Invite
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Or Enter Email
                </label>
                <Field
                  name="email"
                  placeholder="member@example.com"
                  className="w-full border rounded-lg p-2"
                />
                {errors.email && touched.email && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setSearch("");
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded"
                >
                  Invite
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default InviteMemberModal;
