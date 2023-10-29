import {
  FieldErrorType,
  TaskTypeAPI,
  TodoTaskPriority,
  TodoTaskStatus,
  TodolistTypeAPI,
  UpdateTaskModelType,
  todolistsAPI,
} from "../../api/todolists-api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import { setAppStatus } from "../../app/app-reducer";
import { AppRootStateType } from "../../app/store";
import {
  AddTodolistType,
  RemoveTodolistType,
  SetTodolistsType,
  addTodolist,
  fetchTodolists,
  removeTodolist,
} from "./todolists-reducer";

export type TodolistOfTasksType = {
  [key: string]: TaskTypeAPI[];
};

export const addTask = createAsyncThunk<
  TaskTypeAPI,
  { todolistId: string; taskTitle: string },
  { rejectValue: { errors: string[]; fieldsErrors?: FieldErrorType[] } }
>("tasks/addTask", async (param, { dispatch, rejectWithValue }) => {
  const { todolistId, taskTitle } = param;
  try {
    dispatch(setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.createTask(todolistId, taskTitle);
    if (res.data.resultCode === 0) {
      dispatch(setAppStatus({ status: "succeeded" }));
      return res.data.data.item ;
    } else {
     handleServerAppError(res.data, dispatch, false);
      return rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      });
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch, false);
    //fixme
    let err = { errors: ["some error"], fieldsErrors: undefined };
    if (error instanceof Error && error.message) {
      return rejectWithValue({ ...err, errors: [error.message] });
    } else {
      return rejectWithValue(err);
    }
  }
});

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (param: { todolistId: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.getTasks(param.todolistId);
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todolistId: param.todolistId, tasks: res.data.items };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

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
    const targetTask = state.tasks[todolistId].find((t: TaskTypeAPI) => t.id === taskId);
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
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

type RemoveTaskParamType = {
  todolistId: string;
  taskId: string;
};
export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (param: RemoveTaskParamType, { dispatch, rejectWithValue }) => {
    const { todolistId, taskId } = param;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      await todolistsAPI.deleteTask(todolistId, taskId);
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todolistId, taskId };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const asyncActions = {
  addTask,
  fetchTasks,
  updateTask,
  removeTask,
};

const slice = createSlice({
  name: "tasks",
  initialState: {} as TodolistOfTasksType,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addTodolist.fulfilled, (stateDraft, action) => {
      stateDraft[action.payload.todolist.id] = [];
    });
    builder.addCase(fetchTodolists.fulfilled, (stateDraft, action) => {
      action.payload.todolists.forEach((tl: TodolistTypeAPI) => {
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

export const tasksReducer = slice.reducer;
//fixme
export type TasksActionsType = SetTodolistsType | AddTodolistType | RemoveTodolistType;
