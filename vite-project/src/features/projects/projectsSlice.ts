import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  members: { id: string; email: string }[];
  createdAt?: string;
}

interface ProjectsState {
  projects: Project[];
  project: Project | null;
  dashboard: null;
  loading: boolean;
  error?: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  project: null,
  dashboard: null,
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

export const searchUsersToInvite = createAsyncThunk(
  "projectInvite/searchUsers",
  async (
    { projectId, query }: { projectId: string; query: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(`/projects/${projectId}/invite/search`, {
        params: { query },
      });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
    }
  }
);

export const fetchProjectDetails = createAsyncThunk(
  "projects/fetchProjectDetails",
  async (projectId: string, thunkAPI) => {
    try {
      const res = await api.get(`/projects/${projectId}/project-details`);
      return res.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Project's members failed"
      );
    }
  }
);

export const removeProjectMember = createAsyncThunk(
  "projects/removeMember",
  async (
    { projectId, memberId }: { projectId: string; memberId: string },
    thunkAPI
  ) => {
    try {
      const res = await api.delete(
        `/projects/${projectId}/remove-member/${memberId}`
      );
      return { memberId, ...res.data };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Project's members failed"
      );
    }
  }
);

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/projects/get-dashboard-stats");
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch");
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
      .addCase(fetchProjectDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.project = null;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      // Search users
      .addCase(searchUsersToInvite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsersToInvite.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(searchUsersToInvite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(removeProjectMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeProjectMember.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeProjectMember.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = projectsSlice.actions;
export default projectsSlice.reducer;
