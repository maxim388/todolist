import { v1 } from "uuid";
import {
  REMOVE_TODOLIST,
  RemoveTodolistACType,
  ADD_TODOLIST,
  SET_TODOLISTS,
  SetTodolistACType,
  AddTodolistACType,
} from "./todolists-reducer";
import {
  TaskTypeAPI,
  TodoTaskPriority,
  TodoTaskStatus,
} from "../api/todolists-api";

const REMOVE_TASK = "REMOVE-TASK";
const ADD_TASK = "ADD-TASK";
const CHANGE_TASK_STATUS = "CHANGE-TASK-STATUS";
const CHANGE_TASK_TITLE = "CHANGE-TASK-TITLE";

const initialState: TodolistOfTasksType = {};

export type TodolistOfTasksType = {
  [key: string]: TaskTypeAPI[];
};

type ActionsType =
  | RemoveTaskACType
  | AddTaskACType
  | ChangeTaskStatusACType
  | ChangeTaskTitleACType
  | SetTodolistACType
  | AddTodolistACType
  | RemoveTodolistACType;

export const tasksReducer = (
  state: TodolistOfTasksType = initialState,
  action: ActionsType
): TodolistOfTasksType => {
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
          {
            id: v1(),
            title: action.title,
            description: "",
            todoListId: action.todolistId,
            order: 0,
            status: TodoTaskStatus.New,
            priority: TodoTaskPriority.Later,
            startDate: "",
            deadline: "",
            addedDate: "",
          },
          ...state[action.todolistId],
        ],
      };
    case CHANGE_TASK_STATUS:
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((t) =>
          t.id === action.taskId ? { ...t, status: action.status } : t
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
    case SET_TODOLISTS:
      const copyState = { ...state };
      action.todolists.forEach((tl) => {
        copyState[tl.id] = [];
      });
      return copyState;
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
  status: TodoTaskStatus,
  todolistId: string
) => {
  return {
    type: CHANGE_TASK_STATUS,
    taskId,
    status,
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
