import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TodolistTypeAPI, todolistsAPI } from "../../api/todolists-api";
import { handleServerNetworkError } from "../../utils/error-utils";
import { RequestStatusType, setAppStatusAC } from "./app-reducer";

export type FilterValuesType = "All" | "Active" | "Completed";

export type TodolistDomainType = TodolistTypeAPI & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const addTodolistTC = createAsyncThunk(
  "todolists/addTodolist",
  async (param: { todolistTitle: string }, { dispatch, rejectWithValue }) => {
    const { todolistTitle } = param;
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await todolistsAPI.createTodolist(todolistTitle);
      dispatch(setAppStatusAC({ status: "succeeded" }));
      return { todolist: res.data.data.item };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const fetchTodolistsTC = createAsyncThunk(
  "todolists/fetchTodolists",
  async (param, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await todolistsAPI.getTodolists();
      dispatch(setAppStatusAC({ status: "succeeded" }));
      return { todolists: res.data };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const changeTodolistTitleTC = createAsyncThunk(
  "todolists/changeTodolistTitle",
  async (
    param: { todolistId: string; title: string },
    { dispatch, rejectWithValue }
  ) => {
    const { todolistId, title } = param;
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      await todolistsAPI.updateTodolistTitle(todolistId, title);
      dispatch(setAppStatusAC({ status: "succeeded" }));
      return { todolistId, title };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const changeTodolistFilterTC = createAsyncThunk(
  "todolists/changeTodolistFilter",
  async (
    param: { todolistId: string; filter: FilterValuesType },
    { dispatch, rejectWithValue }
  ) => {
    const { todolistId, filter } = param;
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      dispatch(setAppStatusAC({ status: "succeeded" }));
      return { todolistId, filter };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const removeTodolistTC = createAsyncThunk(
  "todolists/removeTodolist",
  async (param: { todolistId: string }, { dispatch, rejectWithValue }) => {
    const { todolistId } = param;
    try {
      dispatch(changeTodolistEntityStatusAC({ todolistId, status: "loading" }));
      dispatch(setAppStatusAC({ status: "loading" }));
      await todolistsAPI.deleteTodolist(todolistId);
      dispatch(setAppStatusAC({ status: "succeeded" }));
      dispatch(changeTodolistEntityStatusAC({ todolistId, status: "idle" }));
      return { todolistId };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      dispatch(changeTodolistEntityStatusAC({ todolistId, status: "idle" }));
      return rejectWithValue(null);
    }
  }
);

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
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
  },
  extraReducers: (builder) => {
    builder.addCase(addTodolistTC.fulfilled, (stateDraft, action) => {
      stateDraft.unshift({
        ...action.payload.todolist,
        filter: "All",
        entityStatus: "idle",
      });
    });
    builder.addCase(fetchTodolistsTC.fulfilled, (stateDraft, action) => {
      return action.payload.todolists.map((tl: TodolistTypeAPI) => ({
        ...tl,
        filter: "All",
        entityStatus: "idle",
      }));
    });
    builder.addCase(changeTodolistTitleTC.fulfilled, (stateDraft, action) => {
      const index = stateDraft.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index !== -1) {
        stateDraft[index].title = action.payload.title;
      }
    });
    builder.addCase(changeTodolistFilterTC.fulfilled, (stateDraft, action) => {
      const index = stateDraft.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index !== -1) {
        stateDraft[index].filter = action.payload.filter;
      }
    });
    builder.addCase(removeTodolistTC.fulfilled, (stateDraft, action) => {
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
export const {
  changeTodolistEntityStatusAC,
} = slice.actions;

export type TodolistsActionsType =
  | AddTodolistACType
  | SetTodolistsACType
  | ChangeTodolistEntityStatusACType
  | RemoveTodolistACType;

export type AddTodolistACType = ReturnType<typeof addTodolistTC.fulfilled>;
export type SetTodolistsACType = ReturnType<typeof fetchTodolistsTC.fulfilled>;
type ChangeTodolistEntityStatusACType = ReturnType<
  typeof changeTodolistEntityStatusAC
>;
export type RemoveTodolistACType = ReturnType<
  typeof removeTodolistTC.fulfilled
>;
