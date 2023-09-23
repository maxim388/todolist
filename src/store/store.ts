import {
  applyMiddleware,
  combineReducers,
  createStore,
} from "redux";
import { TasksActionsType, tasksReducer } from "../reducers/tasks-reducer";
import {
  TodolistsActionsType,
  todolistsReducer,
} from "../reducers/todolists-reducer";
import thunkMiddleware, { ThunkAction, ThunkDispatch } from "redux-thunk";
// import { configureStore } from "@reduxjs/toolkit";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
});
// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

// export const store = configureStore({
//   reducer: {
//     todolists: todolistsReducer,
//     tasks: tasksReducer,
//   },
// });

// определить автоматически тип всего объекта состояния
// export type AppRootStateType = ReturnType<typeof rootReducer>;
export type AppRootStateType = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AppActionsType>;
//все типы actions для App
export type AppActionsType = TodolistsActionsType | TasksActionsType;

export type AppThunkType<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  AppActionsType
>;

// @ts-ignore
window.store = store;