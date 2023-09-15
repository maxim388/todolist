import { v1 } from "uuid";
import { TodolistTypeAPI, todolistsAPI } from "../api/todolists-api";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { setTasksAC } from "./tasks-reducer";
import { AppActionsType, AppThunkType } from "../store/store";

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
    case REMOVE_TODOLIST:
      return state.filter((t) => t.id !== action.todolistId);
    case ADD_TODOLIST:
      return [
        {
          id: action.todolistId,
          title: action.title,
          addedDate: String(new Date()),
          order: 0,
          filter: "All",
        },
        ...state,
      ];
    case CHANGE_TODOLIST_TITLE:
      return state.map((t) =>
        t.id === action.todolistId ? { ...t, title: action.title } : t
      );
    case CHANGE_TODOLIST_FILTER:
      return state.map((t) =>
        t.id === action.todolistId ? { ...t, filter: action.filter } : t
      );
    case SET_TODOLISTS:
      return action.todolists;
    default:
      return state;
  }
};
export type TodolistsActionsType =
  | RemoveTodolistACType
  | AddTodolistACType
  | ChangeTodolistTitleACType
  | ChangeTodolistFilterACType
  | SetTodolistsACType;

export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>;
export type AddTodolistACType = ReturnType<typeof addTodolistAC>;
export type ChangeTodolistTitleACType = ReturnType<
  typeof changeTodolistTitleAC
>;
export type ChangeTodolistFilterACType = ReturnType<
  typeof changeTodolistFilterAC
>;
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>;

export const removeTodolistAC = (todolistId: string) => {
  return { type: REMOVE_TODOLIST, todolistId } as const;
};
export const addTodolistAC = (title: string) => {
  return {
    type: ADD_TODOLIST,
    title,
    todolistId: v1(),
  } as const;
};

export const changeTodolistTitleAC = (title: string, todolistId: string) => {
  return {
    type: CHANGE_TODOLIST_TITLE,
    todolistId,
    title,
  } as const;
};

export const changeTodolistFilterAC = (
  filter: FilterValuesType,
  todolistId: string
) => {
  return {
    type: CHANGE_TODOLIST_FILTER,
    filter,
    todolistId,
  } as const;
};

export const setTodolistsAC = (todolists: TodolistDomainType[]) => {
  return {
    type: SET_TODOLISTS,
    todolists,
  } as const;
};

export const fetchTodolistsTC = (): AppThunkType => {
  return (dispatch) => {
    todolistsAPI.getTodolists().then((res) => {
      dispatch(setTodolistsAC(res.data));
    });
  };
};

// export const fetchTodolistsTC = (): AppThunkType => async (dispatch) => {
//   try {
//     const res = await todolistsAPI.getTodolists();
//     dispatch(setTodolistsAC(res.data));
//   } catch (e) {
//     throw new Error(e);
//   }
// };
