
interface ConfirmDeleteModalProps {
  open: boolean;
  title?: string;
  message?: string;
  highlight?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  open,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
  highlight,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-6">
          {message}{" this "}
          {highlight && <span className="font-semibold text-red-600">{highlight}</span>} project ?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
