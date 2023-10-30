import { handleServerAppError } from "./../../utils/error-utils";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { todolistsAPI } from "../../api/todolists-api";
import { RequestStatusType } from "../../api/application-reducer";
import { handleServerNetworkError } from "../../utils/error-utils";
import { ThunkErrorType } from "../../app/store";
import { appActions } from "../../api";
import { TodolistAPIType } from "../../api/types";

export type FilterValuesType = "All" | "Active" | "Completed";

export type TodolistDomainType = TodolistAPIType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

const { setAppStatus } = appActions;

export const addTodolist = createAsyncThunk<
  { todolist: TodolistAPIType },
  { todolistTitle: string },
  ThunkErrorType
>("todolists/addTodolist", async (param, { dispatch, rejectWithValue }) => {
  const { todolistTitle } = param;
  try {
    dispatch(setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.createTodolist(todolistTitle);
    if (res.data.resultCode === 0) {
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todolist: res.data.data.item };
    } else {
      return handleServerAppError(res.data, dispatch, rejectWithValue, false);
    }
  } catch (error) {
    return handleServerNetworkError(error, dispatch, rejectWithValue, false);
  }
});

export const fetchTodolists = createAsyncThunk<
  { todolists: TodolistAPIType[] },
  undefined,
  ThunkErrorType
>("todolists/fetchTodolists", async (param, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.getTodolists();
    dispatch(setAppStatus({ status: "succeeded" }));
    return { todolists: res.data };
  } catch (error) {
    return handleServerNetworkError(error, dispatch, rejectWithValue);
  }
});

export const changeTodolistTitle = createAsyncThunk<
  { todolistId: string; title: string },
  { todolistId: string; title: string },
  ThunkErrorType
>("todolists/changeTodolistTitle", async (param, { dispatch, rejectWithValue }) => {
  const { todolistId, title } = param;
  try {
    dispatch(setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.updateTodolistTitle(todolistId, title);
    if (res.data.resultCode === 0) {
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todolistId, title };
    } else {
      return handleServerAppError(res.data, dispatch, rejectWithValue, false);
    }
  } catch (error) {
    return handleServerNetworkError(error, dispatch, rejectWithValue, false);
  }
});

export const changeTodolistFilter = createAsyncThunk<
  { todolistId: string; filter: FilterValuesType },
  { todolistId: string; filter: FilterValuesType },
  ThunkErrorType
>("todolists/changeTodolistFilter", async (param, { dispatch, rejectWithValue }) => {
  const { todolistId, filter } = param;
  try {
    dispatch(setAppStatus({ status: "loading" }));
    //fixme
    dispatch(setAppStatus({ status: "succeeded" }));
    return { todolistId, filter };
  } catch (error) {
    return handleServerNetworkError(error, dispatch, rejectWithValue);
  }
});

export const removeTodolist = createAsyncThunk<
  { todolistId: string },
  { todolistId: string },
  ThunkErrorType
>("todolists/removeTodolist", async (param, { dispatch, rejectWithValue }) => {
  const { todolistId } = param;
  try {
    dispatch(changeTodolistEntityStatus({ todolistId, status: "loading" }));
    dispatch(setAppStatus({ status: "loading" }));
    await todolistsAPI.deleteTodolist(todolistId);
    dispatch(setAppStatus({ status: "succeeded" }));
    return { todolistId };
  } catch (error) {
    return handleServerNetworkError(error, dispatch, rejectWithValue);
  } finally {
    dispatch(changeTodolistEntityStatus({ todolistId, status: "idle" }));
  }
});

export const asyncActions = {
  addTodolist,
  fetchTodolists,
  changeTodolistTitle,
  changeTodolistFilter,
  removeTodolist,
};

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistEntityStatus(
      stateDraft,
      action: PayloadAction<{ todolistId: string; status: RequestStatusType }>
    ) {
      const index = stateDraft.findIndex((tl) => tl.id === action.payload.todolistId);
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
      return action.payload.todolists.map((tl: TodolistAPIType) => ({
        ...tl,
        filter: "All",
        entityStatus: "idle",
      }));
    });
    builder.addCase(changeTodolistTitle.fulfilled, (stateDraft, action) => {
      const index = stateDraft.findIndex((tl) => tl.id === action.payload.todolistId);
      if (index !== -1) {
        stateDraft[index].title = action.payload.title;
      }
    });
    builder.addCase(changeTodolistFilter.fulfilled, (stateDraft, action) => {
      const index = stateDraft.findIndex((tl) => tl.id === action.payload.todolistId);
      if (index !== -1) {
        stateDraft[index].filter = action.payload.filter;
      }
    });
    builder.addCase(removeTodolist.fulfilled, (stateDraft, action) => {
      const index = stateDraft.findIndex((tl) => tl.id === action.payload.todolistId);
      if (index !== -1) {
        stateDraft.splice(index, 1);
      }
    });
  },
});

export const { changeTodolistEntityStatus } = todolistsSlice.actions;

export type TodolistsActionsType =
  | AddTodolistType
  | SetTodolistsType
  | ChangeTodolistEntityStatusType
  | RemoveTodolistType;

export type AddTodolistType = ReturnType<typeof addTodolist.fulfilled>;
export type SetTodolistsType = ReturnType<typeof fetchTodolists.fulfilled>;
type ChangeTodolistEntityStatusType = ReturnType<typeof changeTodolistEntityStatus>;
export type RemoveTodolistType = ReturnType<typeof removeTodolist.fulfilled>;
