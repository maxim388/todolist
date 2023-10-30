import { FieldErrorType } from './../api/types';
import { TasksActionsType } from "../features/TodolistsList/tasks-reducer";
import { TodolistsActionsType } from "../features/TodolistsList/todolists-reducer";
import thunkMiddleware, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AuthActionsType } from "../features/Auth/auth-reducer";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "../features/Auth";
import { tasksReducer, todolistsReducer } from "../features/TodolistsList";
import { appReducer } from "../features/Application";
import { AppActionsType } from '../features/common-actions/app';

const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware),
});

export type AppRootStateType = ReturnType<typeof store.getState>;

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, ActionsType>;

type ActionsType = TodolistsActionsType | TasksActionsType | 
AppActionsType |
 AuthActionsType;

export type AppThunkType<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  ActionsType
>;

export type ThunkErrorType = {
  rejectValue: { errors: string[]; fieldsErrors?: FieldErrorType[] };
};

// @ts-ignore
window.store = store;
