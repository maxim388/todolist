import { combineReducers } from "redux";
import { TasksActionsType, tasksReducer } from "../features/TodolistsList/tasks-reducer";
import {
  TodolistsActionsType,
  todolistsReducer,
} from "../features/TodolistsList/todolists-reducer";
import thunkMiddleware, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { ActionsType, appReducer } from "./app-reducer";
import { AuthActionsType, authReducer } from "../features/Auth/auth-reducer";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(thunkMiddleware),
});


export type AppRootStateType = ReturnType<typeof store.getState>;

export type AppDispatch = ThunkDispatch<
  AppRootStateType,
  unknown,
  AppActionsType
>;

export type AppActionsType =
  | TodolistsActionsType
  | TasksActionsType
  | ActionsType
  | AuthActionsType;

export type AppThunkType<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  AppActionsType
>;

// @ts-ignore
window.store = store;
