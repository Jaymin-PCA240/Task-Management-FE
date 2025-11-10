import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Paper,
  Button,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { type AppDispatch, type RootState } from "../app/store";
import { logoutThunk } from "../features/auth/authSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GroupsIcon from "@mui/icons-material/Groups";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.auth.user);

  const stats = [
    {
      label: "Total Invitations",
      value: 8,
      icon: (
        <GroupsIcon
          sx={{
            fontSize: 40,
            color: "#ffffff",
            background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
            borderRadius: "12px",
            padding: "6px",
          }}
        />
      ),
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Total Projects",
      value: 13,
      icon: (
        <DashboardIcon
          sx={{
            fontSize: 40,
            color: "#ffffff",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: "12px",
            padding: "6px",
          }}
        />
      ),
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Completed Tasks",
      value: 2,
      icon: (
        <CheckCircleIcon
          sx={{
            fontSize: 40,
            color: "#ffffff",
            background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
            borderRadius: "12px",
            padding: "6px",
          }}
        />
      ),
      color: "from-orange-400 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 shadow-sm">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-grow px-6 py-16 md:px-10 space-y-10 mt-4">
        {/* Welcome Section */}
        <Paper
          elevation={4}
          sx={{
            backgroundImage: "none",
            background:
              "linear-gradient(135deg, hsl(213, 72%, 21%) 0%, #3e88b6 100%)",
            color: "white",
          }}
          className="bg-gradient-to-r from-indigo-700 via-blue-600 to-blue-500 text-white rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center shadow-xl"
        >
          <Box className="flex items-center space-x-6">
            <Avatar
              src={user?.avatar || "/default-avatar.png"}
              sx={{ width: 90, height: 90, border: "3px solid white" }}
            />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Welcome, {user?.name || "User"} 👋
              </Typography>
              <Typography variant="body1" className="opacity-90">
                Let’s organize your tasks for today
              </Typography>
            </Box>
          </Box>

          <Box className="flex space-x-6 mt-6 md:mt-0">
            <Box className="bg-white/20 backdrop-blur-md p-5 rounded-2xl text-center w-36 shadow-md">
              <Typography variant="subtitle1" fontWeight="bold">
                2 Completed
              </Typography>
              <LinearProgress
                variant="determinate"
                value={40}
                sx={{ mt: 1, height: 6, borderRadius: 2, bgcolor: "white/30" }}
              />
            </Box>
            <Box className="bg-white/20 backdrop-blur-md p-5 rounded-2xl text-center w-36 shadow-md">
              <Typography variant="subtitle1" fontWeight="bold">
                50 Total Tasks
              </Typography>
              <LinearProgress
                variant="determinate"
                value={80}
                sx={{ mt: 1, height: 6, borderRadius: 2, bgcolor: "white/30" }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Stats Section */}
        <Grid
          container
          spacing={4}
          md={12}
          sm={12}
          alignItems="stretch"
          sx={{ mt: 2 }}
        >
          {stats.map((item, i) => (
            <Grid
              item
              xs={12} // 1 card per row on mobile
              sm={6} // 2 per row on tablet
              md={4} // 3 per row on desktop
              key={i}
              display="flex"
              justifyContent="center"
            >
              <Card
                sx={{
                  flex: 1,
                  width: "100%",
                  borderRadius: "20px",
                  backgroundImage:
                    "linear-gradient(135deg, hsl(213, 72%, 21%) 0%, #3e88b6 100%)",
                  color: "#fff",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                  "&:hover": {
                    transform: "scale(1.04)",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    width: "100%",
                    textAlign: "center",
                    p: 3,
                  }}
                >
                  {item.icon}
                  <Typography variant="h4" fontWeight="bold">
                    {item.value}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    {item.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Logout Button */}
        <Box className="flex justify-center mt-6">
          <Button
            variant="contained"
            color="error"
            onClick={() => dispatch(logoutThunk())}
            className="rounded-full px-8 py-2 shadow-md hover:shadow-lg"
          >
            Logout
          </Button>
        </Box>
      </main>

      <Footer />
    </div>
  );
}
