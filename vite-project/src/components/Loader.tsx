import React from "react";

const Loader: React.FC= () => {
  const spinner = (
    <div
      className={`animate-spin rounded-full border-t-transparent border-solid border-blue-600 w-12 h-12 border-4`}
    />
  );

  return (
    <div className="flex flex-col items-center justify-center">
      {spinner}
    </div>
  );
};

export default Loader;
