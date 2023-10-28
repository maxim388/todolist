import {
  SetTodolistsACType,
  AddTodolistACType,
  fetchTodolistsTC,
  removeTodolistTC,
  addTodolistTC,
  RemoveTodolistACType,
} from "./todolists-reducer";
import {
  TaskTypeAPI,
  TodoTaskPriority,
  TodoTaskStatus,
  TodolistTypeAPI,
  UpdateTaskModelType,
  todolistsAPI,
} from "../../api/todolists-api";
import { setAppStatusAC } from "../../app/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppRootStateType } from "../../app/store";

export type TodolistOfTasksType = {
  [key: string]: TaskTypeAPI[];
};

export const addTaskTC = createAsyncThunk(
  "tasks/addTask",
  async (
    param: { todolistId: string; taskTitle: string },
    { dispatch, rejectWithValue }
  ) => {
    const { todolistId, taskTitle } = param;
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await todolistsAPI.createTask(todolistId, taskTitle);
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({ status: "succeeded" }));
        return { task: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const fetchTasksTC = createAsyncThunk(
  "tasks/fetchTasks",
  async (param: { todolistId: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await todolistsAPI.getTasks(param.todolistId);
      dispatch(setAppStatusAC({ status: "succeeded" }));
      return { todolistId: param.todolistId, tasks: res.data.items };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export type UpdateTaskTCParamType = {
  todolistId: string;
  taskId: string;
  domainModel: UpdateDomainTaskModelType;
};
type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TodoTaskStatus;
  priority?: TodoTaskPriority;
  startDate?: string;
  deadline?: string;
};
export const updateTaskTC = createAsyncThunk(
  "tasks/updateTask",
  async (
    param: UpdateTaskTCParamType,
    { dispatch, getState, rejectWithValue }
  ) => {
    const { todolistId, taskId, domainModel } = param;
    const state = getState() as AppRootStateType;
    const targetTask = state.tasks[todolistId].find(
      (t: TaskTypeAPI) => t.id === taskId
    );
    if (!targetTask) {
      return rejectWithValue("Task not found in the state");
    }
    const apiModel: UpdateTaskModelType = {
      title: targetTask.title,
      description: targetTask.description,
      status: targetTask.status,
      priority: targetTask.priority,
      startDate: targetTask.startDate,
      deadline: targetTask.deadline,
      ...domainModel,
    };
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel);
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({ status: "succeeded" }));
        return { todolistId, taskId, property: domainModel };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

type RemoveTaskTCParamType = {
  todolistId: string;
  taskId: string;
};
export const removeTaskTC = createAsyncThunk(
  "tasks/removeTask",
  async (param: RemoveTaskTCParamType, { dispatch, rejectWithValue }) => {
    const { todolistId, taskId } = param;
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      await todolistsAPI.deleteTask(todolistId, taskId);
      dispatch(setAppStatusAC({ status: "succeeded" }));
      return { todolistId, taskId };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

const slice = createSlice({
  name: "tasks",
  initialState: {} as TodolistOfTasksType,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addTodolistTC.fulfilled, (stateDraft, action) => {
      stateDraft[action.payload.todolist.id] = [];
    });
    builder.addCase(fetchTodolistsTC.fulfilled, (stateDraft, action) => {
      action.payload.todolists.forEach((tl: TodolistTypeAPI) => {
        stateDraft[tl.id] = [];
      });
    });
    builder.addCase(removeTodolistTC.fulfilled, (stateDraft, action) => {
      delete stateDraft[action.payload.todolistId];
    });
    builder.addCase(addTaskTC.fulfilled, (stateDraft, action) => {
      stateDraft[action.payload.task.todoListId].unshift(action.payload.task);
    });
    builder.addCase(fetchTasksTC.fulfilled, (stateDraft, action) => {
      stateDraft[action.payload.todolistId] = action.payload.tasks;
    });
    builder.addCase(updateTaskTC.fulfilled, (stateDraft, action) => {
      const tasks = stateDraft[action.payload.todolistId];
      const taskIndex = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...action.payload.property };
      }
    });
    builder.addCase(removeTaskTC.fulfilled, (stateDraft, action) => {
      const tasks = stateDraft[action.payload!.todolistId];
      const taskIndex = tasks.findIndex((t) => t.id === action.payload!.taskId);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
      }
    });
  },
});

export const tasksReducer = slice.reducer;

export type TasksActionsType =
  | SetTodolistsACType
  | AddTodolistACType
  | RemoveTodolistACType;
