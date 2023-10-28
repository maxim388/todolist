import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAppStatusAC } from "../../app/app-reducer";
import {
  TaskTypeAPI,
  TodoTaskPriority,
  TodoTaskStatus,
  UpdateTaskModelType,
  todolistsAPI,
} from "../../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { AppRootStateType } from "../../app/store";


export const addTask = createAsyncThunk(
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

export const fetchTasks = createAsyncThunk(
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
export const updateTask = createAsyncThunk(
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
export const removeTask = createAsyncThunk(
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
