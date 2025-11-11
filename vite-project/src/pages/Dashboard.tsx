import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaUsers, FaClipboardList, FaCheckCircle } from "react-icons/fa";

export default function Dashboard() {
  const user = useSelector((s: RootState) => s.auth.user);

  const stats = [
    {
      label: "Total Invitations",
      value: 8,
      icon: <FaUsers className="text-white text-3xl" />,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      label: "Total Projects",
      value: 13,
      icon: <FaClipboardList className="text-white text-3xl" />,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      label: "Completed Tasks",
      value: 2,
      icon: <FaCheckCircle className="text-white text-3xl" />,
      gradient: "from-orange-400 to-red-500",
    },
  ];

  return (
    <div className="w-full max-w-[1600px] ">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-indigo-700 via-blue-600 to-blue-500 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center shadow-lg gap-6">
        <div className="flex items-center gap-4 md:gap-6">
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt="User Avatar"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">
              Welcome, {user?.name || "User"} 👋
            </h2>
            <p className="text-white/90 text-sm md:text-base">
              Let’s organize your tasks for today
            </p>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap justify-center md:justify-end">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl text-center w-32 md:w-36 shadow-md">
            <p className="font-semibold text-sm md:text-base">2 Completed</p>
            <div className="w-full bg-white/30 rounded-full h-2 mt-2">
              <div className="bg-white h-2 rounded-full w-[40%]"></div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl text-center w-32 md:w-36 shadow-md">
            <p className="font-semibold text-sm md:text-base">50 Total Tasks</p>
            <div className="w-full bg-white/30 rounded-full h-2 mt-2">
              <div className="bg-white h-2 rounded-full w-[80%]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
        {stats.map((item, i) => (
          <div
            key={i}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg text-white bg-gradient-to-br ${item.gradient} transition-transform transform hover:scale-105`}
          >
            <div className="mb-3">{item.icon}</div>
            <h3 className="text-4xl font-bold">{item.value}</h3>
            <p className="opacity-90 text-sm md:text-base mt-1">{item.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
