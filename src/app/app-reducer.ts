import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI } from "../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { setIsLoggedInAC } from "../features/Auth/auth-reducer";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

export type InitialStateType = {
  status: RequestStatusType;
  error: string | null;
  isInitialized: boolean;
};

export const initializeAppTC = createAsyncThunk(
  "app/initializeApp",
  async (param, { dispatch }) => {
    try {
      const res = await authAPI.me();
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
      return
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  }
);

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle",
    error: null,
    isInitialized: false,
  } as InitialStateType,
  reducers: {
    setAppStatusAC(
      stateDraft,
      action: PayloadAction<{ status: RequestStatusType }>
    ) {
      stateDraft.status = action.payload.status;
    },
    setAppErrorAC(stateDraft, action: PayloadAction<{ error: string | null }>) {
      stateDraft.error = action.payload.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeAppTC.fulfilled, (stateDraft, action) => {
      stateDraft.isInitialized = true;
    });
  },
});

export const appReducer = slice.reducer;
export const {
  setAppStatusAC,
  setAppErrorAC,
} = slice.actions;

export type ActionsType = SetAppStatusACType | SetAppErrorACType;

export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>;
