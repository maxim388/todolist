import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { authAPI } from "../../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { AppThunkType } from "../store";
import { setIsLoggedInAC } from "./auth-reducer";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

export type InitialStateType = {
  status: RequestStatusType;
  error: string | null;
  isInitialized: boolean;
};

const initialState: InitialStateType = {
  status: "idle",
  error: null,
  isInitialized: false,
};

const slice = createSlice({
  name: "app",
  initialState: initialState,
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
    setAppInitializedAC(stateDraft, action: PayloadAction<{ value: boolean }>) {
      stateDraft.isInitialized = action.payload.value;
    },
  },
});

export const appReducer = slice.reducer;
export const { setAppStatusAC, setAppErrorAC, setAppInitializedAC } =
  slice.actions;

export type ActionsType =
  | SetAppStatusACType
  | SetAppErrorACType
  | SetAppInitializedACType;

export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>;
export type SetAppInitializedACType = ReturnType<typeof setAppInitializedAC>;

export const initializeAppTC = (): AppThunkType => {
  return async (dispatch) => {
    try {
      const res = await authAPI.me();
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ value: true }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
      dispatch(setAppInitializedAC({ value: true }));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};
