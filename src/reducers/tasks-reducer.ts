import { v1 } from "uuid";
import { TodolistOfTasksType } from "../AppWithRedux";
import {
  ADD_TODOLIST,
  AddTodolistACType,
  REMOVE_TODOLIST,
  RemoveTodolistACType,
  todolistId1,
  todolistId2,
} from "./todolists-reducer";

const REMOVE_TASK = "REMOVE-TASK";
const ADD_TASK = "ADD-TASK";
const CHANGE_TASK_STATUS = "CHANGE-TASK-STATUS";
const CHANGE_TASK_TITLE = "CHANGE-TASK-TITLE";

const initialState: TodolistOfTasksType = {
  [todolistId1]: [
    { id: v1(), title: "HTML&CSS", isDone: true },
    { id: v1(), title: "JS/TS", isDone: true },
    { id: v1(), title: "ReactJS", isDone: false },
    { id: v1(), title: "Redux", isDone: false },
    { id: v1(), title: "REST API", isDone: false },
  ],
  [todolistId2]: [
    { id: v1(), title: "book", isDone: false },
    { id: v1(), title: "milk", isDone: true },
  ],
};

type ActionsType =
  | RemoveTaskACType
  | AddTaskACType
  | ChangeTaskStatusACType
  | ChangeTaskTitleACType
  | AddTodolistACType
  | RemoveTodolistACType;

export const tasksReducer = (
  state: TodolistOfTasksType = initialState,
  action: ActionsType
): TodolistOfTasksType => {
  // debugger;
  switch (action.type) {
    case REMOVE_TASK:
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(
          (t) => t.id !== action.taskId
        ),
      };
    case ADD_TASK:
      return {
        ...state,
        [action.todolistId]: [
          { id: v1(), title: action.title, isDone: false },
          ...state[action.todolistId],
        ],
      };
    case CHANGE_TASK_STATUS:
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((t) =>
          t.id === action.taskId ? { ...t, isDone: action.isDone } : t
        ),
      };
    case CHANGE_TASK_TITLE:
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((t) =>
          t.id === action.taskId ? { ...t, title: action.newTitle } : t
        ),
      };
    case ADD_TODOLIST:
      return {
        ...state,
        [action.todolistId]: [],
      };
    case REMOVE_TODOLIST:
      const stateCopy = { ...state };
      delete stateCopy[action.todolistId];
      return stateCopy;
    default:
      return state;
  }
};

export type RemoveTaskACType = ReturnType<typeof removeTaskAC>;
export type AddTaskACType = ReturnType<typeof addTaskAC>;
export type ChangeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>;
export type ChangeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>;

export const removeTaskAC = (taskId: string, todolistId: string) => {
  return {
    type: REMOVE_TASK,
    taskId,
    todolistId,
  } as const;
};

export const addTaskAC = (title: string, todolistId: string) => {
  return {
    type: ADD_TASK,
    title,
    todolistId,
  } as const;
};

export const changeTaskStatusAC = (
  taskId: string,
  isDone: boolean,
  todolistId: string
) => {
  return {
    type: CHANGE_TASK_STATUS,
    taskId,
    isDone,
    todolistId,
  } as const;
};

export const changeTaskTitleAC = (
  taskId: string,
  newTitle: string,
  todolistId: string
) => {
  return {
    type: CHANGE_TASK_TITLE,
    taskId,
    newTitle,
    todolistId,
  } as const;
};
