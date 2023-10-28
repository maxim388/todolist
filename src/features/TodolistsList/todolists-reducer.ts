import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TodolistTypeAPI } from "../../api/todolists-api";
import { RequestStatusType } from "../../app/app-reducer";
import {
  addTodolist,
  fetchTodolists,
  changeTodolistTitle,
  changeTodolistFilter,
  removeTodolist,
} from "./todolists-actions";

export type FilterValuesType = "All" | "Active" | "Completed";

export type TodolistDomainType = TodolistTypeAPI & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistEntityStatus(
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
  },
  extraReducers: (builder) => {
    builder.addCase(addTodolist.fulfilled, (stateDraft, action) => {
      stateDraft.unshift({
        ...action.payload.todolist,
        filter: "All",
        entityStatus: "idle",
      });
    });
    builder.addCase(fetchTodolists.fulfilled, (stateDraft, action) => {
      return action.payload.todolists.map((tl: TodolistTypeAPI) => ({
        ...tl,
        filter: "All",
        entityStatus: "idle",
      }));
    });
    builder.addCase(changeTodolistTitle.fulfilled, (stateDraft, action) => {
      const index = stateDraft.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index !== -1) {
        stateDraft[index].title = action.payload.title;
      }
    });
    builder.addCase(changeTodolistFilter.fulfilled, (stateDraft, action) => {
      const index = stateDraft.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index !== -1) {
        stateDraft[index].filter = action.payload.filter;
      }
    });
    builder.addCase(removeTodolist.fulfilled, (stateDraft, action) => {
      const index = stateDraft.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index !== -1) {
        stateDraft.splice(index, 1);
      }
    });
  },
});

export const todolistsReducer = slice.reducer;
export const { changeTodolistEntityStatus } = slice.actions;

export type TodolistsActionsType =
  | AddTodolistType
  | SetTodolistsType
  | ChangeTodolistEntityStatusType
  | RemoveTodolistType;

export type AddTodolistType = ReturnType<typeof addTodolist.fulfilled>;
export type SetTodolistsType = ReturnType<typeof fetchTodolists.fulfilled>;
type ChangeTodolistEntityStatusType = ReturnType<typeof changeTodolistEntityStatus>;
export type RemoveTodolistType = ReturnType<typeof removeTodolist.fulfilled>;
