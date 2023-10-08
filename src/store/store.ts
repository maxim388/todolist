import { combineReducers } from "redux";
import { TasksActionsType, tasksReducer } from "./reducers/tasks-reducer";
import {
  TodolistsActionsType,
  todolistsReducer,
} from "./reducers/todolists-reducer";
import thunkMiddleware, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { ActionsType, appReducer } from "./reducers/app-reducer";
import { AuthActionsType, authReducer } from "./reducers/auth-reducer";
import { configureStore } from "@reduxjs/toolkit";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer,
});
// непосредственно создаём store
// export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(thunkMiddleware),
});

// определить автоматически тип всего объекта состояния
// export type AppRootStateType = ReturnType<typeof rootReducer>;
export type AppRootStateType = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
export type AppDispatch = ThunkDispatch<
  AppRootStateType,
  unknown,
  AppActionsType
>;
//все типы actions для App
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
