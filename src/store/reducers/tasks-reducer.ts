import { action } from "@storybook/addon-actions";
import {
  RemoveTodolistACType,
  SetTodolistsACType,
  AddTodolistACType,
  addTodolistAC,
  removeTodolistAC,
  setTodolistsAC,
} from "./todolists-reducer";
import {
  TaskTypeAPI,
  TodoTaskPriority,
  TodoTaskStatus,
  UpdateTaskModelType,
  todolistsAPI,
} from "../../api/todolists-api";
import { AppThunkType } from "../store";
import { setAppStatusAC } from "./app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: TodolistOfTasksType = {};

export type TodolistOfTasksType = {
  [key: string]: TaskTypeAPI[];
};

export const fetchTasksTC = createAsyncThunk(
  "tasks/fetchTasks",
  async (param: { todolistId: string }, thunkAPI) => {
    try {
      thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
      const res = await todolistsAPI.getTasks(param.todolistId);
      thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }));
      return { todolistId: param.todolistId, tasks: res.data.items };
    } catch (error) {
      handleServerNetworkError(error, thunkAPI.dispatch);
    }
  }
);

export const removeTaskTC = createAsyncThunk(
  "tasks/removeTask",
  async (param: { todolistId: string; taskId: string }, thunkAPI) => {
    const { todolistId, taskId } = param;
    try {
      thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
      await todolistsAPI.deleteTask(todolistId, taskId);
      thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }));
      return { todolistId, taskId };
    } catch (error) {
      handleServerNetworkError(error, thunkAPI.dispatch);
    }
  }
);

// _________________
const slice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    addTaskAC(stateDraft, action: PayloadAction<{ task: TaskTypeAPI }>) {
      stateDraft[action.payload.task.todoListId].unshift(action.payload.task);
    },
    updateTaskAC(
      stateDraft,
      action: PayloadAction<{
        todolistId: string;
        taskId: string;
        property: UpdateDomainTaskModelType;
      }>
    ) {
      const tasks = stateDraft[action.payload.todolistId];
      const taskIndex = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...action.payload.property };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTodolistAC, (stateDraft, action) => {
      stateDraft[action.payload.todolist.id] = [];
    });
    builder.addCase(setTodolistsAC, (stateDraft, action) => {
      action.payload.todolists.forEach((tl) => {
        stateDraft[tl.id] = [];
      });
    });
    builder.addCase(removeTodolistAC, (stateDraft, action) => {
      delete stateDraft[action.payload.todolistId];
    });
    builder.addCase(fetchTasksTC.fulfilled, (stateDraft, action) => {
     
        stateDraft[action.payload!.todolistId] = action.payload!.tasks;
     
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
export const { addTaskAC, updateTaskAC } = slice.actions;

export type TasksActionsType =
  | AddTaskACType
  | SetTodolistsACType
  | UpdateTaskACType
  | AddTodolistACType
  | RemoveTodolistACType;

type AddTaskACType = ReturnType<typeof addTaskAC>;
type UpdateTaskACType = ReturnType<typeof updateTaskAC>;

export const addTaskTC = (
  todolistId: string,
  taskTitle: string
): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await todolistsAPI.createTask(todolistId, taskTitle);
      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        dispatch(addTaskAC({ task }));
        dispatch(setAppStatusAC({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};

type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TodoTaskStatus;
  priority?: TodoTaskPriority;
  startDate?: string;
  deadline?: string;
};

export const updateTaskTC = (
  todolistId: string,
  taskId: string,
  domainModel: UpdateDomainTaskModelType
): AppThunkType => {
  return async (dispatch, getState) => {
    const targetTask = getState().tasks[todolistId].find(
      (t) => t.id === taskId
    );
    if (!targetTask) {
      throw new Error("Task not found in the state");
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
        dispatch(updateTaskAC({ todolistId, taskId, property: domainModel }));
        dispatch(setAppStatusAC({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};
