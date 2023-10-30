import { todolistsAPI } from "../../api/todolists-api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import { appActions } from "../../api";
import { AppRootStateType, ThunkErrorType } from "../../app/store";
import {
  AddTodolistType,
  RemoveTodolistType,
  SetTodolistsType,
  addTodolist,
  fetchTodolists,
  removeTodolist,
} from "./todolists-reducer";
import {
  TaskAPIType,
  TodoTaskPriority,
  TodoTaskStatus,
  TodolistAPIType,
  UpdateTaskModelType,
} from "../../api/types";

export type TodolistOfTasksType = {
  [key: string]: TaskAPIType[];
};

const { setAppStatus } = appActions;

export const addTask = createAsyncThunk<
  TaskAPIType,
  { todolistId: string; taskTitle: string },
  ThunkErrorType
>("tasks/addTask", async (param, { dispatch, rejectWithValue }) => {
  const { todolistId, taskTitle } = param;
  try {
    dispatch(setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.createTask(todolistId, taskTitle);
    if (res.data.resultCode === 0) {
      dispatch(setAppStatus({ status: "succeeded" }));
      return res.data.data.item;
    } else {
      return handleServerAppError(res.data, dispatch, rejectWithValue, false);
    }
  } catch (error) {
    return handleServerNetworkError(error, dispatch, rejectWithValue, false);
  }
});

export const fetchTasks = createAsyncThunk<
  { todolistId: string; tasks: TaskAPIType[] },
  { todolistId: string },
  ThunkErrorType
>("tasks/fetchTasks", async (param, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.getTasks(param.todolistId);
    dispatch(setAppStatus({ status: "succeeded" }));
    return { todolistId: param.todolistId, tasks: res.data.items };
  } catch (error) {
    return handleServerNetworkError(error, dispatch, rejectWithValue);
  }
});

export type UpdateTaskParamType = {
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
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (param: UpdateTaskParamType, { dispatch, getState, rejectWithValue }) => {
    const { todolistId, taskId, domainModel } = param;
    const state = getState() as AppRootStateType;
    const targetTask = state.tasks[todolistId].find((t: TaskAPIType) => t.id === taskId);
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
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel);
      if (res.data.resultCode === 0) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { todolistId, taskId, property: domainModel };
      } else {
        return handleServerAppError(res.data, dispatch, rejectWithValue);
      }
    } catch (error) {
      return handleServerNetworkError(error, dispatch, rejectWithValue);
    }
  }
);

type RemoveTaskParamType = {
  todolistId: string;
  taskId: string;
};
export const removeTask = createAsyncThunk<
  { todolistId: string; taskId: string },
  RemoveTaskParamType,
  ThunkErrorType
>("tasks/removeTask", async (param: RemoveTaskParamType, { dispatch, rejectWithValue }) => {
  const { todolistId, taskId } = param;
  try {
    dispatch(setAppStatus({ status: "loading" }));
    await todolistsAPI.deleteTask(todolistId, taskId);
    dispatch(setAppStatus({ status: "succeeded" }));
    return { todolistId, taskId };
  } catch (error) {
    return handleServerNetworkError(error, dispatch, rejectWithValue);
  }
});

export const asyncActions = {
  addTask,
  fetchTasks,
  updateTask,
  removeTask,
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TodolistOfTasksType,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addTodolist.fulfilled, (stateDraft, action) => {
      stateDraft[action.payload.todolist.id] = [];
    });
    builder.addCase(fetchTodolists.fulfilled, (stateDraft, action) => {
      action.payload.todolists.forEach((tl: TodolistAPIType) => {
        stateDraft[tl.id] = [];
      });
    });
    builder.addCase(removeTodolist.fulfilled, (stateDraft, action) => {
      delete stateDraft[action.payload.todolistId];
    });
    builder.addCase(addTask.fulfilled, (stateDraft, action) => {
      stateDraft[action.payload.todoListId].unshift(action.payload);
    });
    builder.addCase(fetchTasks.fulfilled, (stateDraft, action) => {
      stateDraft[action.payload.todolistId] = action.payload.tasks;
    });
    builder.addCase(updateTask.fulfilled, (stateDraft, action) => {
      const tasks = stateDraft[action.payload.todolistId];
      const taskIndex = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...action.payload.property };
      }
    });
    builder.addCase(removeTask.fulfilled, (stateDraft, action) => {
      const tasks = stateDraft[action.payload!.todolistId];
      const taskIndex = tasks.findIndex((t) => t.id === action.payload!.taskId);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
      }
    });
  },
});

export type TasksActionsType = SetTodolistsType | AddTodolistType | RemoveTodolistType;
