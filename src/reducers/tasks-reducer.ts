import { v1 } from "uuid";
import {
  REMOVE_TODOLIST,
  RemoveTodolistACType,
  ADD_TODOLIST,
  SET_TODOLISTS,
  SetTodolistsACType,
  AddTodolistACType,
} from "./todolists-reducer";
import {
  TaskTypeAPI,
  TodoTaskPriority,
  TodoTaskStatus,
  todolistsAPI,
} from "../api/todolists-api";
import { AppThunkType } from "../store/store";

const REMOVE_TASK = "REMOVE_TASK";
const ADD_TASK = "ADD_TASK";
const CHANGE_TASK_STATUS = "CHANGE_TASK_STATUS";
const CHANGE_TASK_TITLE = "CHANGE_TASK_TITLE";
const SET_TASKS = "SET_TASKS";

const initialState: TodolistOfTasksType = {};

export type TodolistOfTasksType = {
  [key: string]: TaskTypeAPI[];
};

export const tasksReducer = (
  state: TodolistOfTasksType = initialState,
  action: TasksActionsType
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
    case SET_TASKS:
      return {
        ...state,
        [action.todolistId]: action.tasks,
      };
    default:
      return state;
  }
};

export type TasksActionsType =
  | RemoveTaskACType
  | AddTaskACType
  | ChangeTaskStatusACType
  | ChangeTaskTitleACType
  | SetTodolistsACType
  | AddTodolistACType
  | RemoveTodolistACType
  | SetTasksACType;

type RemoveTaskACType = ReturnType<typeof removeTaskAC>;
type AddTaskACType = ReturnType<typeof addTaskAC>;
type ChangeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>;
type ChangeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>;
type SetTasksACType = ReturnType<typeof setTasksAC>;

export const removeTaskAC = (todolistId: string, taskId: string) => {
  return {
    type: REMOVE_TASK,
    todolistId,
    taskId,
  } as const;
};

export const addTaskAC = (todolistId: string, title: string) => {
  return {
    type: ADD_TASK,
    todolistId,
    title,
  } as const;
};

export const changeTaskStatusAC = (
  todolistId: string,
  taskId: string,
  status: TodoTaskStatus
) => {
  return {
    type: CHANGE_TASK_STATUS,
    todolistId,
    taskId,
    status,
  } as const;
};

export const changeTaskTitleAC = (
  todolistId: string,
  taskId: string,
  newTitle: string
) => {
  return {
    type: CHANGE_TASK_TITLE,
    todolistId,
    taskId,
    newTitle,
  } as const;
};

export const setTasksAC = (todolistId: string, tasks: TaskTypeAPI[]) => {
  return {
    type: SET_TASKS,
    todolistId,
    tasks,
  } as const;
};

export const fetchTasksTC = (todolistId: string): AppThunkType => {
  return async (dispatch) => {
    try {
      const res = await todolistsAPI.getTasks(todolistId);
      dispatch(setTasksAC(todolistId, res.data.items)); //fix
    } catch (e) {
      console.log(e);
    }
  };
};

export const removeTaskTC = (
  todolistId: string,
  taskId: string
): AppThunkType => {
  return async (dispatch) => {
    try {
      await todolistsAPI.deleteTask(todolistId, taskId);
      dispatch(removeTaskAC(todolistId, taskId));
    } catch (e) {
      console.log(e);
    }
  };
};
