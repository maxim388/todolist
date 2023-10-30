import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoginParamsType } from "../../api/types";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import { ThunkErrorType } from "../../app/store";
import { authAPI } from "../../api/todolists-api";
import { commonActions } from "../common-actions/app";

const { setAppStatus } = commonActions

const login = createAsyncThunk<undefined, LoginParamsType, ThunkErrorType>(
  "auth/login",
  async (param, { dispatch, rejectWithValue }) => {
    const { email, password, rememberMe } = param;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await authAPI.login({ email, password, rememberMe });
      if (res.data.resultCode === 0) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return;
      } else {
        return handleServerAppError(res.data, dispatch, rejectWithValue);
      }
    } catch (error) {
      return handleServerNetworkError(error, dispatch, rejectWithValue);
    }
  }
);

const logout = createAsyncThunk<{ isLoggedIn: boolean }, undefined, ThunkErrorType>(
  "auth/logout",
  async (param, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await authAPI.logout();
      if (res.data.resultCode === 0) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: false };
      } else {
        return handleServerAppError(res.data, dispatch, rejectWithValue);
      }
    } catch (error) {
      return handleServerNetworkError(error, dispatch, rejectWithValue);
    }
  }
);

export const asyncActions = {
  login,
  logout,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false },
  reducers: {
    setIsLoggedIn(stateDraft, action: PayloadAction<{ isLoggedIn: boolean }>) {
      stateDraft.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (stateDraft, action) => {
      stateDraft.isLoggedIn = true;
    });
    builder.addCase(logout.fulfilled, (stateDraft, action) => {
      stateDraft.isLoggedIn = false;
    });
  },
});

export const { setIsLoggedIn } = authSlice.actions;

export type AuthActionsType = ReturnType<typeof setIsLoggedIn>;
