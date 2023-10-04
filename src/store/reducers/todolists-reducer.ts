import { TodolistTypeAPI, todolistsAPI } from "../../api/todolists-api";
import { handleServerNetworkError } from "../../utils/error-utils";
import { AppThunkType } from "../store";
import {
  RequestStatusType,
  setAppStatusAC,
} from "./app-reducer";

export const REMOVE_TODOLIST = "todolist/REMOVE_TODOLIST";
export const ADD_TODOLIST = "todolist/ADD_TODOLIST";
export const SET_TODOLISTS = "todolist/SET_TODOLISTS";
const CHANGE_TODOLIST_TITLE = "todolist/CHANGE_TODOLIST_TITLE";
const CHANGE_TODOLIST_FILTER = "todolist/CHANGE_TODOLIST_FILTER";
const CHANGE_TODOLIST_ENTITY_STATUS = "todolist/CHANGE_TODOLIST_ENTITY_STATUS";

const initialState: TodolistDomainType[] = [];

export type FilterValuesType = "All" | "Active" | "Completed";

export type TodolistDomainType = TodolistTypeAPI & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const todolistsReducer = (
  state: TodolistDomainType[] = initialState,
  action: TodolistsActionsType
): TodolistDomainType[] => {
  switch (action.type) {
    case ADD_TODOLIST:
      return [
        {
          ...action.todolist,
          filter: "All",
          entityStatus: "idle",
        },
        ...state,
      ];
    case SET_TODOLISTS:
      return action.todolists.map((tl) => {
        return {
          ...tl,
          filter: "All",
          entityStatus: "idle",
        };
      });
    case CHANGE_TODOLIST_TITLE:
      return state.map((tl) =>
        tl.id === action.todolistId ? { ...tl, title: action.title } : tl
      );
    case CHANGE_TODOLIST_FILTER:
      return state.map((tl) =>
        tl.id === action.todolistId ? { ...tl, filter: action.filter } : tl
      );
    case CHANGE_TODOLIST_ENTITY_STATUS:
      return state.map((tl) =>
        tl.id === action.todolistId
          ? { ...tl, entityStatus: action.status }
          : tl
      );
    case REMOVE_TODOLIST:
      return state.filter((t) => t.id !== action.todolistId);
    default:
      return state;
  }
};

export type TodolistsActionsType =
  | AddTodolistACType
  | SetTodolistsACType
  | ChangeTodolistTitleACType
  | ChangeTodolistFilterACType
  | ChangeTodolistEntityStatusACType
  | RemoveTodolistACType;

export type AddTodolistACType = ReturnType<typeof addTodolistAC>;
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>;
type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>;
type ChangeTodolistFilterACType = ReturnType<typeof changeTodolistFilterAC>;
type ChangeTodolistEntityStatusACType = ReturnType<
  typeof changeTodolistEntityStatusAC
>;
export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>;

export const addTodolistAC = (todolist: TodolistTypeAPI) => {
  return {
    type: ADD_TODOLIST,
    todolist,
  } as const;
};
export const setTodolistsAC = (todolists: TodolistDomainType[]) => {
  return {
    type: SET_TODOLISTS,
    todolists,
  } as const;
};
export const changeTodolistTitleAC = (todolistId: string, title: string) => {
  return {
    type: CHANGE_TODOLIST_TITLE,
    todolistId,
    title,
  } as const;
};
export const changeTodolistFilterAC = (
  todolistId: string,
  filter: FilterValuesType
) => {
  return {
    type: CHANGE_TODOLIST_FILTER,
    todolistId,
    filter,
  } as const;
};
export const changeTodolistEntityStatusAC = (
  todolistId: string,
  status: RequestStatusType
) => {
  return {
    type: CHANGE_TODOLIST_ENTITY_STATUS,
    todolistId,
    status,
  } as const;
};
export const removeTodolistAC = (todolistId: string) => {
  return { type: REMOVE_TODOLIST, todolistId } as const;
};

export const addTodolistTC = (todolistTitle: string): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setAppStatusAC("loading"));
      const res = await todolistsAPI.createTodolist(todolistTitle); //fix rename createTodolist - addTodolistTC (add|create)
      dispatch(addTodolistAC(res.data.data.item)); //fix data.data
      dispatch(setAppStatusAC("succeeded"));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};

export const fetchTodolistsTC = (): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setAppStatusAC("loading"));
      const res = await todolistsAPI.getTodolists();
      dispatch(setTodolistsAC(res.data));
      dispatch(setAppStatusAC("succeeded"));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};

export const changeTodolistTitleTC = (
  todolistId: string,
  title: string
): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setAppStatusAC("loading"));
      await todolistsAPI.updateTodolistTitle(todolistId, title);
      dispatch(changeTodolistTitleAC(todolistId, title));
      dispatch(setAppStatusAC("succeeded"));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};

export const changeTodolistFilterTC = (
  todolistId: string,
  filter: FilterValuesType
): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setAppStatusAC("loading"));
      dispatch(changeTodolistFilterAC(todolistId, filter));
      dispatch(setAppStatusAC("succeeded"));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};

export const removeTodolistTC = (todolistId: string): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(changeTodolistEntityStatusAC(todolistId, "loading"));
      dispatch(setAppStatusAC("loading"));
      await todolistsAPI.deleteTodolist(todolistId);
      dispatch(removeTodolistAC(todolistId));
      dispatch(setAppStatusAC("succeeded"));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    } finally {
      dispatch(changeTodolistEntityStatusAC(todolistId, "idle"));
    }
  };
};
