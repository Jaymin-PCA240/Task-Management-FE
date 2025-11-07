import { Button } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../app/store";
import { logoutThunk } from '../features/auth/authSlice';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.auth.user);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Welcome, {user?.name}</h1>
      <Button variant="outlined" onClick={() => dispatch(logoutThunk())}>Logout</Button>
    </div>
  );
}
