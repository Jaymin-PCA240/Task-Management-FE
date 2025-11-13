import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100">
      <div className="sticky top-0 z-50 shadow-sm bg-white">
        <Header />
      </div>

      <main className="flex-grow flex justify-center px-4 pt-20 pb-12 md:px-10 ">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
