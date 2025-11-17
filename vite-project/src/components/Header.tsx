import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../app/store";
import { logoutThunk } from "../features/auth/authSlice";
import { LogOut, User } from "lucide-react";

export default function Header() {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="mx-auto w-full max-w-[1600px] flex items-center justify-between px-4 md:px-10 py-3">
        {/* Left Logo */}
        <Link to="/" className="flex items-center md:gap-2">
          <img src="/logo.svg" alt="BaseTeam Logo" className="w-8 h-8" />
          <span className="font-semibold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent hover:from-blue-800 hover:to-blue-600 transition-colors duration-300 text-lg">
            TaskFlow
          </span>
        </Link>

        {/* Center Nav */}
        {accessToken && (
          <div className="flex items-center gap-2 md:gap-6 text-gray-700 font-medium">
            <Link
              to="/dashboard"
              className={`transition-colors duration-200 ${
                isActive("/dashboard")
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              className={`transition-colors duration-200 ${
                isActive("/projects")
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Projects
            </Link>
            <Link
              to="/invitations"
              className={`transition-colors duration-200 ${
                isActive("/invitations")
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Invitations
            </Link>
          </div>
        )}

        {/* Right User Dropdown */}
        {accessToken ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenMenu((p) => !p)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 hover:to-blue-400 text-white font-semibold uppercase">
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border border-gray-100 rounded-lg overflow-hidden z-50">
                <div className="px-4 py-2 text-gray-800 border-b font-medium">
                  {user?.name || "User"}
                </div>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setOpenMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  <User className="w-4 h-4 mr-2" /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3 items-center">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1.5 rounded-md bg-gradient-to-r from-blue-700 to-blue-500 hover:to-blue-400 text-white transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
