import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
  items: Project[];
  loading: boolean;
  error?: string | null;
}

const initialState: ProjectsState = { items: [], loading: false, error: null };

// Thunks
export const fetchProjects = createAsyncThunk("projects/fetch", async () => {
  const res = await api.get("/projects/get-projects");
  return res.data.data as Project[];
});

export const createProject = createAsyncThunk(
  "projects/create",
  async (payload: { name: string; description?: string }) => {
    const res = await api.post("/projects", payload);
    return res.data.data as Project;
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, body }: { id: string; body: Partial<Project> }) => {
    const res = await api.put(`/projects/${id}`, body);
    return res.data.data as Project;
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id: string) => {
    await api.delete(`/projects/${id}`);
    return id;
  }
);

export const inviteMember = createAsyncThunk(
  "projects/invite",
  async ({ id, email }: { id: string; email: string }) => {
    const res = await api.post(`/projects/${id}/invite`, { email });
    return res.data.data;
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
      .addCase(fetchProjects.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchProjects.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchProjects.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || "Failed";
      })

      .addCase(createProject.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })
      .addCase(updateProject.fulfilled, (s, a) => {
        s.items = s.items.map((p) => (p._id === a.payload._id ? a.payload : p));
      })
      .addCase(deleteProject.fulfilled, (s, a: PayloadAction<string>) => {
        s.items = s.items.filter((p) => p._id !== a.payload);
      });
  },
});

export const { clearError } = projectsSlice.actions;
export default projectsSlice.reducer;
