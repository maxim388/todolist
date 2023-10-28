import React from "react";
import { Provider } from "react-redux";
import { combineReducers } from "redux";
import { v1 } from "uuid";
import { tasksReducer } from "../features/TodolistsList/tasks-reducer";
import { todolistsReducer } from "../features/TodolistsList/todolists-reducer";
import { AppRootStateType } from "../app/store";
import { TodoTaskPriority, TodoTaskStatus } from "../api/todolists-api";
import { appReducer } from "../app/app-reducer";
import thunkMiddleware from "redux-thunk";
import { authReducer } from "../features/Auth/auth-reducer";
import { configureStore } from "@reduxjs/toolkit";
import { HashRouter } from "react-router-dom";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});

const initialGlobalState: AppRootStateType = {
  todolists: [
    {
      id: "todolistId1",
      title: "What to learn",
      addedDate: String(new Date()),
      order: 0,
      filter: "All",
      entityStatus: "idle",
    },
    {
      id: "todolistId2",
      title: "What to buy",
      addedDate: String(new Date()),
      order: 0,
      filter: "All",
      entityStatus: "loading",
    },
  ],
  tasks: {
    todolistId1: [
      {
        id: v1(),
        title: "HTML&CSS",
        description: "",
        todoListId: "todolistId1",
        order: 0,
        status: TodoTaskStatus.Completed,
        priority: TodoTaskPriority.Later,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: v1(),
        title: "JS",
        description: "",
        todoListId: "todolistId1",
        order: 0,
        status: TodoTaskStatus.New,
        priority: TodoTaskPriority.Later,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
    ],
    todolistId2: [
      {
        id: v1(),
        title: "Milk",
        description: "",
        todoListId: "todolistId2",
        order: 0,
        status: TodoTaskStatus.New,
        priority: TodoTaskPriority.Later,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: v1(),
        title: "React Book",
        description: "",
        todoListId: "todolistId2",
        order: 0,
        status: TodoTaskStatus.Completed,
        priority: TodoTaskPriority.Later,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
    ],
  },
  app: {
    status: "succeeded",
    error: null,
    isInitialized: true,
  },
  auth: {
    isLoggedIn: true,
  },
};

export const storyBookStore = configureStore({
  reducer: rootReducer,
  preloadedState: initialGlobalState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(thunkMiddleware),
});

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};

export const HashRouterDecorator = (storyFn: () => React.ReactNode) => {
  return <HashRouter>{storyFn()}</HashRouter>;
};
