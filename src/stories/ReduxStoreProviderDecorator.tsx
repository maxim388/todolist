import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { v1 } from "uuid";
import { tasksReducer } from "../store/reducers/tasks-reducer";
import { todolistsReducer } from "../store/reducers/todolists-reducer";
import { AppRootStateType } from "../store/store";
import { TodoTaskPriority, TodoTaskStatus } from "../api/todolists-api";
import { appReducer } from "../store/reducers/app-reducer";
import thunkMiddleware from "redux-thunk";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
});

const initialGlobalState = {
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
    ["todolistId1"]: [
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
    ["todolistId2"]: [
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
    status: "loading",
    error: null,
    isInitialized: false,
  },
  auth: {
    isLoggedIn: false,
  },
};

export const storyBookStore = legacy_createStore(
  rootReducer,
  initialGlobalState as AppRootStateType,
  applyMiddleware(thunkMiddleware)
);

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};
