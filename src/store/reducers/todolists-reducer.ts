import { TodolistTypeAPI, todolistsAPI } from "../../api/todolists-api";
import { AppThunkType } from "../store";
import { processingErrorTC, setStatusAC } from "./app-reducer";

export const REMOVE_TODOLIST = "REMOVE-TODOLIST";
export const ADD_TODOLIST = "ADD-TODOLIST";
export const SET_TODOLISTS = "SET_TODOLISTS";
const CHANGE_TODOLIST_TITLE = "CHANGE-TODOLIST-TITLE";
const CHANGE_TODOLIST_FILTER = "CHANGE-TODOLIST-FILTER";

const initialState: TodolistDomainType[] = [];

export type FilterValuesType = "All" | "Active" | "Completed";

export type TodolistDomainType = TodolistTypeAPI & { filter: FilterValuesType };

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
        },
        ...state,
      ];
    case SET_TODOLISTS:
      return action.todolists;
    case CHANGE_TODOLIST_TITLE:
      return state.map((tl) =>
        tl.id === action.todolistId ? { ...tl, title: action.title } : tl
      );
    case CHANGE_TODOLIST_FILTER:
      return state.map((tl) =>
        tl.id === action.todolistId ? { ...tl, filter: action.filter } : tl
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
  | RemoveTodolistACType;

export type AddTodolistACType = ReturnType<typeof addTodolistAC>;
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>;
type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>;
type ChangeTodolistFilterACType = ReturnType<typeof changeTodolistFilterAC>;
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
export const removeTodolistAC = (todolistId: string) => {
  return { type: REMOVE_TODOLIST, todolistId } as const;
};

export const addTodolistTC = (todolistTitle: string): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setStatusAC("loading"));
      const res = await todolistsAPI.createTodolist(todolistTitle); //fix rename createTodolist - addTodolistTC (add|create)
      dispatch(addTodolistAC(res.data.data.item)); //fix data.data
      dispatch(setStatusAC("succeeded"));
    } catch (e) {
      dispatch(processingErrorTC(e));
    }
  };
};

export const fetchTodolistsTC = (): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setStatusAC("loading"));
      const res = await todolistsAPI.getTodolists();
      dispatch(setTodolistsAC(res.data));
      dispatch(setStatusAC("succeeded"));
    } catch (e) {
      dispatch(processingErrorTC(e));
    }
  };
};

export const changeTodolistTitleTC = (
  todolistId: string,
  title: string
): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setStatusAC("loading"));
      await todolistsAPI.updateTodolistTitle(todolistId, title);
      dispatch(changeTodolistTitleAC(todolistId, title));
      dispatch(setStatusAC("succeeded"));
    } catch (e) {
      dispatch(processingErrorTC(e));
    }
  };
};

export const changeTodolistFilterTC = (
  todolistId: string,
  filter: FilterValuesType
): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setStatusAC("loading"));
      dispatch(changeTodolistFilterAC(todolistId, filter));
      dispatch(setStatusAC("succeeded"));
    } catch (e) {
      dispatch(processingErrorTC(e));
    }
  };
};

export const removeTodolistTC = (todolistId: string): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setStatusAC("loading"));
      await todolistsAPI.deleteTodolist(todolistId);
      dispatch(removeTodolistAC(todolistId));
      dispatch(setStatusAC("succeeded"));
    } catch (e) {
      dispatch(processingErrorTC(e));
    }
  };
};
