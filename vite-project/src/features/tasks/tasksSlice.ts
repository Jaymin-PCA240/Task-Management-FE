import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const fetchTasksByProject = createAsyncThunk(
  "tasks/fetchByProject",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/tasks/task-by-project/${projectId}`);
      return res.data.data; // assuming APIResponse structure
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await api.post("/tasks/create-task", payload);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/tasks/update-task/${id}`, data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const moveTask = createAsyncThunk(
  "tasks/move",
  async (
    { id, status }: { id: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.patch(`/tasks/${id}/move`, { status });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/delete-task/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const commentTask = createAsyncThunk(
  "tasks/comment",
  async ({ id, text }: { id: string; text: string }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/tasks/${id}/add-comment`, { text });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const editComment = createAsyncThunk(
  "tasks/editComment",
  async (
    {
      taskId,
      commentId,
      text,
    }: {
      taskId: string;
      commentId: string;
      text: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/tasks/${taskId}/edit-comment/${commentId}`, {
        text,
      });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "tasks/deleteComment",
  async (
    { taskId, commentId }: { taskId: string; commentId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.delete(
        `/tasks/${taskId}/delete-comment/${commentId}`
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [] as any[],
    loading: false,
    error: null as any,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByProject.fulfilled, (state, { payload }) => {
        state.items = payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder.addCase(createTask.fulfilled, (state, { payload }) => {
      state.items.unshift(payload);
      state.loading = false;
    });
    builder.addCase(updateTask.fulfilled, (state, { payload }) => {
      state.loading = false;
      const idx = state.items.findIndex((t) => t._id === payload._id);
      if (idx !== -1) state.items[idx] = payload;
    });
    builder.addCase(moveTask.fulfilled, (state, { payload }) => {
      state.loading = false;
      const idx = state.items.findIndex((t) => t._id === payload._id);
      if (idx !== -1) state.items[idx] = payload;
    });
    builder.addCase(deleteTask.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.items = state.items.filter((t) => t._id !== payload);
    });
    builder.addCase(commentTask.fulfilled, (state, { payload }) => {
      state.loading = false;
      const idx = state.items.findIndex((t) => t._id === payload._id);
      if (idx !== -1) state.items[idx] = payload;
    });
    builder.addCase(editComment.fulfilled, (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.items = state.items.map((t) =>
        t._id === updated._id ? updated : t
      );
    })
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.items = state.items.map((t) =>
        t._id === updated._id ? updated : t
      );
    });
  },
});

export const { clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
