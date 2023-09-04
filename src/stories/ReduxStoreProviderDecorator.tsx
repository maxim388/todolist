import React from "react";
import { Provider } from "react-redux";
import { combineReducers, legacy_createStore } from "redux";

import { v1 } from "uuid";
import { tasksReducer } from "../reducers/tasks-reducer";
import { todolistsReducer } from "../reducers/todolists-reducer";
import { AppRootStateType } from "../store/store";
import { TodoTaskPriority, TodoTaskStatus } from "../api/todolists-api";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
});

const initialGlobalState = {
  todolists: [
    {
      id: "todolistId1",
      title: "What to learn",
      addedDate: String(new Date()),
      order: 0,
      filter: "All",
    },
    {
      id: "todolistId2",
      title: "What to buy",
      addedDate: String(new Date()),
      order: 0,
      filter: "All",
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
};

// export const storyBookStore = legacy_createStore(rootReducer);
export const storyBookStore = legacy_createStore(
  rootReducer,
  initialGlobalState as AppRootStateType
);

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};
