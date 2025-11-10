import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { RootState } from "../app/store";
import { useSelector } from "react-redux";

export default function Home() {
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      <Header />
      <main className="flex flex-col flex-grow items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 text-center px-4">
        <Logo />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to TaskFlow
        </h1>
        <p className="text-gray-600 mb-6 max-w-sm">
          Manage your projects and daily tasks efficiently with a clean and
          modern dashboard.
        </p>

        {!accessToken && <div className="space-x-3">
          <Button
            variant="contained"
            color="primary"
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
        </div>}
      </main>
      <Footer />
    </div>
  );
}
