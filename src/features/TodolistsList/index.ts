import { TodolistsList } from './TodolistsList';
import { asyncActions as tasksAsyncActions } from "./tasks-reducer";
import { asyncActions as todolistsAsyncActions } from "./todolists-reducer";
import { todolistsSlice } from "./todolists-reducer";
import { tasksSlice } from "./tasks-reducer";

const todolistsActions = {
  ...todolistsAsyncActions,
  ...todolistsSlice.actions,
};

const tasksActions = {
  ...tasksAsyncActions,
  ...tasksSlice.actions,
};

const todolistsReducer = todolistsSlice.reducer;
const tasksReducer = tasksSlice.reducer;

export { tasksActions, todolistsActions, TodolistsList, todolistsReducer, tasksReducer };
