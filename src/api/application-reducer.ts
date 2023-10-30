import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI } from "./todolists-api";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import { authActions } from "../features/Auth";
import { ThunkErrorType } from "../app/store";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

export type InitialStateType = {
  status: RequestStatusType;
  error: string | null;
  isInitialized: boolean;
};

const { setIsLoggedIn } = authActions;

const initializeApp = createAsyncThunk<{ isLoggedIn: boolean }, undefined, ThunkErrorType>(
  "app/initializeApp",
  async (param, { dispatch, rejectWithValue }) => {
    try {
      const res = await authAPI.me();
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }));
        return { isLoggedIn: true };
      } else {
        return handleServerAppError(res.data, dispatch, rejectWithValue);
      }
    } catch (error) {
      return handleServerNetworkError(error, dispatch, rejectWithValue);
    }
  }
);

export const asyncActions = {
  initializeApp,
};

export const appSlice = createSlice({
  name: "app",
  initialState: {
    status: "idle",
    error: null,
    isInitialized: false,
  } as InitialStateType,
  reducers: {
    setAppStatus(stateDraft, action: PayloadAction<{ status: RequestStatusType }>) {
      stateDraft.status = action.payload.status;
    },
    setAppError(stateDraft, action: PayloadAction<{ error: string | null }>) {
      stateDraft.error = action.payload.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeApp.fulfilled, (stateDraft, action) => {
      stateDraft.isInitialized = true;
    });
  },
});

export const { setAppStatus, setAppError } = appSlice.actions;

export type AppActionsType = ReturnType<typeof setAppStatus> | ReturnType<typeof setAppError>;
