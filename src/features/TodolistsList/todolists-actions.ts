import { createAsyncThunk } from "@reduxjs/toolkit";
import { todolistsAPI } from "../../api/todolists-api";
import { handleServerNetworkError } from "../../utils/error-utils";
import { setAppStatusAC } from "../../app/app-reducer";
import { FilterValuesType, changeTodolistEntityStatus } from "./todolists-reducer";

export const addTodolist = createAsyncThunk(
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

export const fetchTodolists = createAsyncThunk(
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

export const changeTodolistTitle = createAsyncThunk(
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

export const changeTodolistFilter = createAsyncThunk(
  "todolists/changeTodolistFilter",
  async (
    param: { todolistId: string; filter: FilterValuesType },
    { dispatch, rejectWithValue }
  ) => {
    const { todolistId, filter } = param;
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      //fix_me
      dispatch(setAppStatusAC({ status: "succeeded" }));
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
      dispatch(setAppStatusAC({ status: "loading" }));
      await todolistsAPI.deleteTodolist(todolistId);
      dispatch(setAppStatusAC({ status: "succeeded" }));
      dispatch(changeTodolistEntityStatus({ todolistId, status: "idle" }));
      return { todolistId };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      dispatch(changeTodolistEntityStatus({ todolistId, status: "idle" }));
      return rejectWithValue(null);
    }
  }
);
