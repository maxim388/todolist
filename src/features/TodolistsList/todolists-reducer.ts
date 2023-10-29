import { handleServerAppError } from './../../utils/error-utils';
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TodolistTypeAPI, todolistsAPI } from "../../api/todolists-api";
import { RequestStatusType, setAppStatus } from "../../app/app-reducer";
import { handleServerNetworkError } from "../../utils/error-utils";

export type FilterValuesType = "All" | "Active" | "Completed";

export type TodolistDomainType = TodolistTypeAPI & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const addTodolist = createAsyncThunk(
  "todolists/addTodolist",
  async (param: { todolistTitle: string }, { dispatch, rejectWithValue }) => {
    const { todolistTitle } = param;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.createTodolist(todolistTitle);
      if (res.data.resultCode === 0) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { todolist: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const fetchTodolists = createAsyncThunk(
  "todolists/fetchTodolists",
  async (param, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.getTodolists();
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todolists: res.data };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const changeTodolistTitle = createAsyncThunk(
  "todolists/changeTodolistTitle",
  async (
    param: { todolistId: string; title: string },
    { dispatch, rejectWithValue }
  ) => {
    const { todolistId, title } = param;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      await todolistsAPI.updateTodolistTitle(todolistId, title);
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todolistId, title };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const changeTodolistFilter = createAsyncThunk(
  "todolists/changeTodolistFilter",
  async (
    param: { todolistId: string; filter: FilterValuesType },
    { dispatch, rejectWithValue }
  ) => {
    const { todolistId, filter } = param;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      //fix_me
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todolistId, filter };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const removeTodolist = createAsyncThunk(
  "todolists/removeTodolist",
  async (param: { todolistId: string }, { dispatch, rejectWithValue }) => {
    const { todolistId } = param;
    try {
      dispatch(changeTodolistEntityStatus({ todolistId, status: "loading" }));
      dispatch(setAppStatus({ status: "loading" }));
      await todolistsAPI.deleteTodolist(todolistId);
      dispatch(setAppStatus({ status: "succeeded" }));
      dispatch(changeTodolistEntityStatus({ todolistId, status: "idle" }));
      return { todolistId };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      dispatch(changeTodolistEntityStatus({ todolistId, status: "idle" }));
      return rejectWithValue(null);
    }
  }
);

export const asyncActions = {
  addTodolist,
  fetchTodolists,
  changeTodolistTitle,
  changeTodolistFilter,
  removeTodolist,
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
type ChangeTodolistEntityStatusType = ReturnType<
  typeof changeTodolistEntityStatus
>;
export type RemoveTodolistType = ReturnType<typeof removeTodolist.fulfilled>;