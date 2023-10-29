import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI } from "../api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import { setIsLoggedIn } from "../features/Auth/auth-reducer";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

export type InitialStateType = {
  status: RequestStatusType;
  error: string | null;
  isInitialized: boolean;
};

export const initializeApp = createAsyncThunk(
  "app/initializeApp",
  async (param, { dispatch, rejectWithValue }) => {
    try {
      const res = await authAPI.me();
      if (res.data.resultCode === 0) {
        // fixme return { isLoggedIn: true };
        dispatch(setIsLoggedIn({ isLoggedIn: true }));
      } else {
        handleServerAppError(res.data, dispatch, rejectWithValue);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch, rejectWithValue);
      return rejectWithValue(null);
    }
  }
);

export const asyncActions = {
  initializeApp,
};

const slice = createSlice({
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

export const appReducer = slice.reducer;
export const { setAppStatus, setAppError } = slice.actions;

export type ActionsType = SetAppStatusType | SetAppErrorType;

export type SetAppStatusType = ReturnType<typeof setAppStatus>;
export type SetAppErrorType = ReturnType<typeof setAppError>;
