import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI } from "../../api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import { authActions } from "../Auth";
import { ThunkErrorType } from "../../app/store";
import { commonActions } from "../common-actions/app";

const { setAppError, setAppStatus } = commonActions;
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setAppStatus, (stateDraft, action) => {
      stateDraft.status = action.payload.status;
    });
    builder.addCase(setAppError, (stateDraft, action) => {
      stateDraft.error = action.payload.error;
    });
    builder.addCase(initializeApp.fulfilled, (stateDraft, action) => {
      stateDraft.isInitialized = true;
    });
  },
});

// export type AppActionsType = ReturnType<typeof setAppStatus> | ReturnType<typeof setAppError>;
