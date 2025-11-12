import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

interface AuthState {
  logs: [],
  loading: boolean,
  error: null | String,
};


const initialState: AuthState = {
  logs: [],
  loading: false,
  error: null,
};

export const fetchActivityLogs = createAsyncThunk(
  "activity/fetchActivityLogs",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/activities/get-project-activity/${projectId}`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch");
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    clearActivityLogs: (state) => {
      state.logs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearActivityLogs } = activitySlice.actions;
export default activitySlice.reducer;
