import React from "react";

interface LoaderProps {
  loading: boolean;
  message?: string;
  size?: "sm" | "md" | "lg";
}

const Loader: React.FC<LoaderProps> = ({ loading, message = "Loading...", size = "md" }) => {
  if (!loading) return null;

  const spinnerSize =
    size === "sm" ? "w-6 h-6 border-2" : size === "lg" ? "w-16 h-16 border-[5px]" : "w-10 h-10 border-4";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
      {/* Spinner */}
      <div
        className={`animate-spin rounded-full border-t-transparent border-solid border-blue-600 ${spinnerSize}`}
      ></div>

      {/* Message */}
      {message && (
        <p className="mt-4 text-gray-700 font-medium text-sm md:text-base animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
