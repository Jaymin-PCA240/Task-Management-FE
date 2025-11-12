import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import type { RootState } from "../app/store";
import { useSelector } from "react-redux";

export default function Home() {
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  return (
    <div className="w-full max-w-[1600px] flex flex-col flex-grow items-center justify-center text-center">
      <Logo />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Welcome to TaskFlow
      </h1>
      <p className="text-gray-600 mb-6 max-w-sm">
        Manage your projects and daily tasks efficiently with a clean and modern
        dashboard.
      </p>

      {!accessToken && (
        <div className="space-x-3">
          <Button
            variant="contained"
            color="primary"
            className="bg-gradient-to-r from-blue-700 to-blue-500 hover:to-blue-400"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
        </div>
      )}
    </div>
  );
}
