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
  UpdateTaskModelType,
  todolistsAPI,
} from "../../api/todolists-api";
import { AppThunkType } from "../store";
import { setAppStatusAC } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";

const REMOVE_TASK = "REMOVE_TASK";
const ADD_TASK = "ADD_TASK";
const UPDATE_TASK = "UPDATE_TASK";
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
    case ADD_TODOLIST:
      return {
        ...state,
        [action.todolist.id]: [],
      };
    case SET_TODOLISTS:
      const copyState = { ...state };
      action.todolists.forEach((tl) => {
        copyState[tl.id] = [];
      });
      return copyState;
    case UPDATE_TASK:
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((t) =>
          t.id === action.taskId ? { ...t, ...action.property } : t
        ),
      };
    case REMOVE_TODOLIST:
      const { [action.todolistId]: _, ...newState } = state;
      return newState;
    case ADD_TASK:
      return {
        ...state,
        [action.task.todoListId]: [
          action.task,
          ...state[action.task.todoListId],
        ],
      };
    case SET_TASKS:
      return {
        ...state,
        [action.todolistId]: action.tasks,
      };
    case REMOVE_TASK:
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(
          (t) => t.id !== action.taskId
        ),
      };
    default:
      return state;
  }
};

export type TasksActionsType =
  | AddTaskACType
  | SetTodolistsACType
  | UpdateTaskACType
  | RemoveTaskACType
  | AddTodolistACType
  | SetTasksACType
  | RemoveTodolistACType;

type AddTaskACType = ReturnType<typeof addTaskAC>;
type SetTasksACType = ReturnType<typeof setTasksAC>;
type UpdateTaskACType = ReturnType<typeof updateTaskAC>;
type RemoveTaskACType = ReturnType<typeof removeTaskAC>;

export const addTaskAC = (task: TaskTypeAPI) => {
  return {
    type: ADD_TASK,
    task,
  } as const;
};
export const setTasksAC = (todolistId: string, tasks: TaskTypeAPI[]) => {
  return {
    type: SET_TASKS,
    todolistId,
    tasks,
  } as const;
};
export const updateTaskAC = (
  todolistId: string,
  taskId: string,
  property: UpdateDomainTaskModelType
) => {
  return {
    type: UPDATE_TASK,
    todolistId,
    taskId,
    property,
  } as const;
};
export const removeTaskAC = (todolistId: string, taskId: string) => {
  return {
    type: REMOVE_TASK,
    todolistId,
    taskId,
  } as const;
};

export const addTaskTC = (
  todolistId: string,
  taskTitle: string
): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setAppStatusAC("loading"));
      const res = await todolistsAPI.createTask(todolistId, taskTitle);
      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        dispatch(addTaskAC(task));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};

export const fetchTasksTC = (todolistId: string): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setAppStatusAC("loading"));
      const res = await todolistsAPI.getTasks(todolistId);
      dispatch(setTasksAC(todolistId, res.data.items)); //fix
      dispatch(setAppStatusAC("succeeded"));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};

type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TodoTaskStatus;
  priority?: TodoTaskPriority;
  startDate?: string;
  deadline?: string;
};

export const updateTaskTC = (
  todolistId: string,
  taskId: string,
  domainModel: UpdateDomainTaskModelType
): AppThunkType => {
  return async (dispatch, getState) => {
    const targetTask = getState().tasks[todolistId].find(
      (t) => t.id === taskId
    );
    if (!targetTask) {
      throw new Error("Task not found in the state");
    }
    const apiModel: UpdateTaskModelType = {
      title: targetTask.title,
      description: targetTask.description,
      status: targetTask.status,
      priority: targetTask.priority,
      startDate: targetTask.startDate,
      deadline: targetTask.deadline,
      ...domainModel,
    };
    try {
      dispatch(setAppStatusAC("loading"));
      const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel);
      if (res.data.resultCode === 0) {
        dispatch(updateTaskAC(todolistId, taskId, domainModel));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};

export const removeTaskTC = (
  todolistId: string,
  taskId: string
): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setAppStatusAC("loading"));
      await todolistsAPI.deleteTask(todolistId, taskId);
      dispatch(removeTaskAC(todolistId, taskId));
      dispatch(setAppStatusAC("succeeded"));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};
