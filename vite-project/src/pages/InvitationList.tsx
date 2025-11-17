import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInvitations,
  approveInvitation,
  rejectInvitation,
} from "../features/invitation/invitationSlice";
import type { RootState, AppDispatch } from "../app/store";
import ConfirmModal from "../components/confirmModal";

export default function InvitationList() {
  const dispatch = useDispatch<AppDispatch>();
  const invitations = useSelector((s: RootState) => s.invitation.list);

  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">(
    "pending"
  );

  // Modal control
  const [openModal, setOpenModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [selectedId, setSelectedId] = useState<string>("");

  const filteredInvitations = invitations.filter(
    (inv) => inv.status === filter
  );

  const handleActionConfirm = () => {
    if (selectedAction === "approve") {
      dispatch(approveInvitation(selectedId));
    } else if (selectedAction === "reject") {
      dispatch(rejectInvitation(selectedId));
    }
    setOpenModal(false);
  };

  useEffect(() => {
    dispatch(fetchInvitations());
  }, []);

  return (
    <div className="w-full max-w-[1600px]">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl text-white py-10 px-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Project Invitations</h1>
          <p className="text-white/90">
            You've been invited to join a new project. Please approve or reject.
          </p>
        </div>

        {/* FILTER */}
        <div className="flex justify-end items-center justify-items-end mb-4 flex-wrap gap-3">
          <select
            className="border px-3 py-2 rounded-md text-sm bg-gray-50"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "pending" | "approved" | "rejected")
            }
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* LIST */}
        {filteredInvitations?.length === 0 ? (
          <p className="text-gray-500 text-center">No invitations found.</p>
        ) : (
          filteredInvitations?.map((inv) => (
            <div
              key={inv._id}
              className="p-4 border rounded-lg mb-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="space-y-1">
                <p className="font-medium text-gray-700">
                  Project:{" "}
                  <span className="text-black">{inv.project.name}</span>
                </p>
                <p className="text-gray-600">
                  Invited By:{" "}
                  <span className="text-black">{inv.invitedBy.name}</span>
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  Status: {inv.status}
                </p>
              </div>

              {inv.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    className="bg-gradient-to-r from-green-700 to-green-500 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm"
                    onClick={() => {
                      setSelectedAction("approve");
                      setSelectedId(inv._id);
                      setOpenModal(true);
                    }}
                  >
                    Approve
                  </button>

                  <button
                    className="bg-gradient-to-r from-red-700 to-red-500 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm"
                    onClick={() => {
                      setSelectedAction("reject");
                      setSelectedId(inv._id);
                      setOpenModal(true);
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={openModal}
        title={
          selectedAction === "approve"
            ? "Approve Invitation"
            : "Reject Invitation"
        }
        message={
          selectedAction === "approve"
            ? "Are you sure you want to approve this invitation?"
            : "Are you sure you want to reject this invitation?"
        }
        onClose={() => setOpenModal(false)}
        onConfirm={handleActionConfirm}
      />
    </div>
  );
}
