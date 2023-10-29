import { TodolistsList } from './TodolistsList';
import { asyncActions as tasksAsyncActions } from "./tasks-reducer";
import { asyncActions as todolistsAsyncActions } from "./todolists-reducer";
import { slice } from "./todolists-reducer";

const todolistsActions = {
  ...todolistsAsyncActions,
  ...slice.actions,
};

const tasksActions = {
  ...tasksAsyncActions,
};

export { tasksActions, todolistsActions, TodolistsList };
