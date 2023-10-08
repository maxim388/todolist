import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TodolistTypeAPI, todolistsAPI } from "../../api/todolists-api";
import { handleServerNetworkError } from "../../utils/error-utils";
import { AppThunkType } from "../store";
import { RequestStatusType, initializeAppTC, setAppStatusAC } from "./app-reducer";

const initialState: TodolistDomainType[] = [];

export type FilterValuesType = "All" | "Active" | "Completed";

export type TodolistDomainType = TodolistTypeAPI & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

const slice = createSlice({
  name: "todolists",
  initialState: initialState,
  reducers: {
    addTodolistAC(
      stateDraft,
      action: PayloadAction<{ todolist: TodolistTypeAPI }>
    ) {
      stateDraft.unshift({
        ...action.payload.todolist,
        filter: "All",
        entityStatus: "idle",
      });
    },
    setTodolistsAC(
      stateDraft,
      action: PayloadAction<{ todolists: TodolistDomainType[] }>
    ) {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: "All",
        entityStatus: "idle",
      }));
    },
    changeTodolistTitleAC(
      stateDraft,
      action: PayloadAction<{ todolistId: string; title: string }>
    ) {
      const index = stateDraft.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index !== -1) {
        stateDraft[index].title = action.payload.title;
      }
    },
    changeTodolistFilterAC(
      stateDraft,
      action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>
    ) {
      const index = stateDraft.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index !== -1) {
        stateDraft[index].filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatusAC(
      stateDraft,
      action: PayloadAction<{ todolistId: string; status: RequestStatusType }>
    ) {
      const index = stateDraft.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index !== -1) {
        stateDraft[index].entityStatus = action.payload.status;
      }
    },
    removeTodolistAC(
      stateDraft,
      action: PayloadAction<{ todolistId: string }>
    ) {
      const index = stateDraft.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index !== -1) {
        stateDraft.splice(index, 1);
      }
    },
  },
});
export const todolistsReducer = slice.reducer;
export const {
  addTodolistAC,
  setTodolistsAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  changeTodolistEntityStatusAC,
  removeTodolistAC,
} = slice.actions;

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

export const addTodolistTC = (todolistTitle: string): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await todolistsAPI.createTodolist(todolistTitle); 
      dispatch(addTodolistAC({todolist: res.data.data.item})); //fix data.data
      dispatch(setAppStatusAC({ status: "succeeded" }));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};

export const fetchTodolistsTC = (): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await todolistsAPI.getTodolists();
      dispatch(setTodolistsAC({todolists: res.data}));
      dispatch(setAppStatusAC({ status: "succeeded" }));
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
      dispatch(setAppStatusAC({ status: "loading" }));
      await todolistsAPI.updateTodolistTitle(todolistId, title);
      dispatch(changeTodolistTitleAC({ todolistId, title }));
      dispatch(setAppStatusAC({ status: "succeeded" }));
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
      dispatch(setAppStatusAC({ status: "loading" }));
      dispatch(changeTodolistFilterAC({ todolistId, filter }));
      dispatch(setAppStatusAC({ status: "succeeded" }));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};

export const removeTodolistTC = (todolistId: string): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(changeTodolistEntityStatusAC({ todolistId, status: "loading" }));
      dispatch(setAppStatusAC({ status: "loading" }));
      await todolistsAPI.deleteTodolist(todolistId);
      dispatch(removeTodolistAC({ todolistId }));
      dispatch(setAppStatusAC({ status: "succeeded" }));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    } finally {
      dispatch(changeTodolistEntityStatusAC({ todolistId, status: "idle" }));
    }
  };
};
