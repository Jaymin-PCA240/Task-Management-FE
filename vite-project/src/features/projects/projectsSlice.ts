import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  members?: { id: string; email: string }[];
  createdAt?: string;
}

interface ProjectsState {
  projects: Project[];
  members: [];
  loading: boolean;
  error?: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  members: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchProjects = createAsyncThunk(
  "projects/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/projects/get-projects");
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Create project failed"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (payload: { name: string; description?: string }, thunkAPI) => {
    try {
      const res = await api.post("/projects/create-project", payload);
      return res.data.data as Project;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Delete project failed"
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, body }: { id: string; body: Partial<Project> }, thunkAPI) => {
    try {
      const res = await api.patch(`/projects/update-project/${id}`, body);
      return res.data.data as Project;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Update project failed"
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id: string, thunkAPI) => {
    try {
      await api.delete(`/projects/delete-project/${id}`);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Delete project failed"
      );
    }
  }
);

export const inviteMember = createAsyncThunk(
  "projects/invite",
  async ({ id, email }: { id: string; email: string }, thunkAPI) => {
    try {
      const res = await api.post(`/projects/${id}/invite`, { email });
      return res.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Invite member failed"
      );
    }
  }
);

export const fetchProjectMembers = createAsyncThunk(
  "projects/fetchMembers",
  async (projectId: string, thunkAPI) => {
    try {
      const res = await api.get(`/projects/${projectId}/members`);
      return res.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Project's members failed"
      );
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.projects = payload.data;
      })
      .addCase(fetchProjects.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = (payload as string) || "Failed";
      });
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createProject.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = (payload as string) || "Failed";
      });
    builder
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProject.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = (payload as string) || "Failed";
      });
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, { payload }) => {
        state.projects = state.projects.filter((p) => p._id !== payload);
        state.loading = false;
      })
      .addCase(deleteProject.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = (payload as string) || "Failed";
      });
    builder
      .addCase(fetchProjectMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.members = [];
      })
      .addCase(fetchProjectMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchProjectMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = projectsSlice.actions;
export default projectsSlice.reducer;
