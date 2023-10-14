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

const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  (todolistId: string, thunkAPI) => {}
);

export const fetchTasksTC = (todolistId: string): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await todolistsAPI.getTasks(todolistId);
      dispatch(setTasksAC({ todolistId, tasks: res.data.items }));
      dispatch(setAppStatusAC({ status: "succeeded" }));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};
// _________________
const slice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    addTaskAC(stateDraft, action: PayloadAction<{ task: TaskTypeAPI }>) {
      stateDraft[action.payload.task.todoListId].unshift(action.payload.task);
    },
    setTasksAC(
      stateDraft,
      action: PayloadAction<{ todolistId: string; tasks: TaskTypeAPI[] }>
    ) {
      stateDraft[action.payload.todolistId] = action.payload.tasks;
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
    removeTaskAC(
      stateDraft,
      action: PayloadAction<{ todolistId: string; taskId: string }>
    ) {
      const tasks = stateDraft[action.payload.todolistId];
      const taskIndex = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
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
  },
});

export const tasksReducer = slice.reducer;
export const { addTaskAC, setTasksAC, updateTaskAC, removeTaskAC } =
  slice.actions;

export type TasksActionsType =
  | AddTaskACType
  | SetTodolistsACType
  | UpdateTaskACType
  | RemoveTaskACType
  | AddTodolistACType
  | SetTasksACType
  | RemoveTodolistACType;

type AddTaskACType = ReturnType<typeof addTaskAC>;
type SetTasksACType = ReturnType<typeof setTasksAC>;
type UpdateTaskACType = ReturnType<typeof updateTaskAC>;
type RemoveTaskACType = ReturnType<typeof removeTaskAC>;

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
        dispatch(addTaskAC({task}));
        dispatch(setAppStatusAC({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};

// export const fetchTasksTC = (todolistId: string): AppThunkType => {
//   return async (dispatch) => {
//     try {
//       dispatch(setAppStatusAC({ status: "loading" }));
//       const res = await todolistsAPI.getTasks(todolistId);
//       dispatch(setTasksAC({ todolistId, tasks: res.data.items }));
//       dispatch(setAppStatusAC({ status: "succeeded" }));
//     } catch (error) {
//       handleServerNetworkError(error, dispatch);
//     }
//   };
// };

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

export const removeTaskTC = (
  todolistId: string,
  taskId: string
): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      await todolistsAPI.deleteTask(todolistId, taskId);
      dispatch(removeTaskAC({ todolistId, taskId }));
      dispatch(setAppStatusAC({ status: "succeeded" }));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};
