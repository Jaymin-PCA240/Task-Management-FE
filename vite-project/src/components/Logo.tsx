import { Link } from "react-router-dom";

export function Logo() {
  return (
    <div className="flex items-center justify-center mb-4 space-x-2">
      <img
        src="/logo.svg"
        alt="TaskFlow Logo"
        className="w-10 h-10"
      />
      <Link to="/"><span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent hover:from-blue-800 hover:to-blue-600 transition-colors duration-300">TaskFlow</span></Link>
    </div>
  );
}
