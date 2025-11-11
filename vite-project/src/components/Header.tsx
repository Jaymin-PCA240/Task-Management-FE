import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../app/store";
import { logoutThunk } from "../features/auth/authSlice";

export default function Header() {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-2 text-black font-semibold text-lg">
          <img src="/logo.svg" alt="TaskFlow Logo" className="w-8 h-8" />
          TaskFlow
        </Link>

        <nav className="flex items-center gap-4 text-black text-sm font-medium">
          {accessToken ? (
            <>
              <Link to="/projects" className="hover:text-indigo-300">Projects</Link>
              <Link to="/dashboard" className="hover:text-indigo-300">Dashboard</Link>
              <button
                onClick={() => dispatch(logoutThunk())}
                className="bg-red-500 px-3 py-1 rounded-md text-black hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-300">Login</Link>
              <Link
                to="/register"
                className="bg-indigo-500 px-3 py-1 rounded-md text-white hover:bg-indigo-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
