import { Link } from "react-router-dom";

export function Logo() {
  return (
    <div className="flex items-center justify-center mb-4 space-x-2">
      <img
        src="/logo.svg"
        alt="TaskFlow Logo"
        className="w-10 h-10"
      />
      <Link to="/"><span className="text-2xl font-bold text-indigo-600">TaskFlow</span></Link>
    </div>
  );
}
