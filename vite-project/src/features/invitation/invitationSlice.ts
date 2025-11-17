import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export interface Invitation {
  _id: string;
  project: string;
  invitedUser: string;
  invitedBy: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface InvitationState {
  list: Invitation[];
  loading: boolean;
  error: string | null;
}

const initialState: InvitationState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchInvitations = createAsyncThunk<Invitation[]>(
  "inv/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/invitations/my-invitations");
      return res.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Fetch invitation failed"
      );
    }
  }
);

export const approveInvitation = createAsyncThunk<Invitation, string>(
  "inv/approve",
  async (id: string, thunkAPI) => {
    try {
      const res = await api.patch(`/invitations/${id}/approve`);
      return res.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Approve invitation failed"
      );
    }
  }
);

export const rejectInvitation = createAsyncThunk<Invitation, string>(
  "inv/reject",
  async (id: string, thunkAPI) => {
    try {
      const res = await api.patch(`/invitations/${id}/reject`);
      return res.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Reject invitation failed"
      );
    }
  }
);

export const inviteMember = createAsyncThunk(
  "invitations/inviteMember",
  async (
    { projectId, userId }: { projectId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post(`invitations/send-invitation`, { projectId, userId });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Invite failed");
    }
  }
);

const invitationSlice = createSlice({
  name: "invitation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Invite member
    builder
    .addCase(inviteMember.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(inviteMember.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(inviteMember.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    builder
      .addCase(fetchInvitations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvitations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchInvitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch invitations";
      })

      .addCase(approveInvitation.fulfilled, (state, action) => {
        state.list = state.list.map((i) =>
          i._id === action.payload._id ? action.payload : i
        );
      })

      .addCase(rejectInvitation.fulfilled, (state, action) => {
        state.list = state.list.map((i) =>
          i._id === action.payload._id ? action.payload : i
        );
      });
  },
});

export default invitationSlice.reducer;
