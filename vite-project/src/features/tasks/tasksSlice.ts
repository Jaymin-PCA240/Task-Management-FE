import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../api/axiosInstance';

export interface Comment {
  id: string;
  authorId: string;
  authorName?: string;
  text: string;
  createdAt?: string;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  status: "todo" | "inprogress" | "review" | "done";
  assignee?: { id: string; name: string } | null;
  comments?: Comment[];
  createdAt?: string;
}

interface TasksState {
  byProject: Record<string, Task[]>;
  loading: boolean;
  error?: string | null;
}

const initialState: TasksState = { byProject: {}, loading: false, error: null };

// Thunks
export const fetchTasksByProject = createAsyncThunk(
  "tasks/fetchByProject",
  async (projectId: string) => {
    const res = await api.get(`/projects/${projectId}/tasks`);
    return { projectId, tasks: res.data.data as Task[] };
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (payload: { projectId: string; title: string; description?: string }) => {
    const res = await api.post(`/projects/${payload.projectId}/tasks`, payload);
    return res.data.data as Task;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, body }: { id: string; body: Partial<Task> }) => {
    const res = await api.put(`/tasks/${id}`, body);
    return res.data.data as Task;
  }
);

export const deleteTask = createAsyncThunk("tasks/delete", async (id: string) => {
  await api.delete(`/tasks/${id}`);
  return id;
});

export const addComment = createAsyncThunk(
  "tasks/addComment",
  async ({ taskId, text }: { taskId: string; text: string }) => {
    const res = await api.post(`/tasks/${taskId}/comments`, { text });
    return res.data.data as Comment & { taskId: string };
  }
);

// move task status (drag & drop)
export const moveTask = createAsyncThunk(
  "tasks/move",
  async ({ id, status }: { id: string; status: Task["status"] }) => {
    const res = await api.patch(`/tasks/${id}/move`, { status });
    return res.data.data as Task;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTasksByProject.fulfilled, (s, a) => {
        s.byProject[a.payload.projectId] = a.payload.tasks;
      })
      .addCase(createTask.fulfilled, (s, a) => {
        const t = a.payload;
        s.byProject[t.projectId] = s.byProject[t.projectId] || [];
        s.byProject[t.projectId].push(t);
      })
      .addCase(updateTask.fulfilled, (s, a) => {
        const t = a.payload;
        const list = s.byProject[t.projectId] || [];
        s.byProject[t.projectId] = list.map((x) => (x._id === t._id ? t : x));
      })
      .addCase(deleteTask.fulfilled, (s, a) => {
        const id = a.payload;
        for (const k of Object.keys(s.byProject)) {
          s.byProject[k] = s.byProject[k].filter((t) => t._id !== id);
        }
      })
      .addCase(addComment.fulfilled, (s, a) => {
        const c = a.payload as Comment & { taskId: string };
        for (const k of Object.keys(s.byProject)) {
          const t = s.byProject[k].find((x) => x._id === c.taskId);
          if (t) {
            t.comments = t.comments || [];
            t.comments.push(c);
            break;
          }
        }
      })
      .addCase(moveTask.fulfilled, (s, a) => {
        const t = a.payload;
        for (const k of Object.keys(s.byProject)) {
          s.byProject[k] = s.byProject[k].filter((x) => x._id !== t._id);
        }
        s.byProject[t.projectId] = s.byProject[t.projectId] || [];
        s.byProject[t.projectId].push(t);
      });
  },
});

export const { clearError } = tasksSlice.actions;
export default tasksSlice.reducer;

