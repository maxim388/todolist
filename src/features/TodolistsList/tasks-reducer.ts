import {
  SetTodolistsType,
  AddTodolistType,
  RemoveTodolistType,
} from "./todolists-reducer";
import {
  fetchTodolists,
  removeTodolist,
  addTodolist
} from "./todolists-actions";
import { TaskTypeAPI, TodolistTypeAPI } from "../../api/todolists-api";

import { createSlice } from "@reduxjs/toolkit";
import {
  addTask,
  fetchTasks,
  removeTask,
  updateTask,
} from "./tasks-actions";

export type TodolistOfTasksType = {
  [key: string]: TaskTypeAPI[];
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
      stateDraft[action.payload.task.todoListId].unshift(action.payload.task);
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

export type TasksActionsType =
  | SetTodolistsType
  | AddTodolistType
  | RemoveTodolistType;
