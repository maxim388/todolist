import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoginParamsType, authAPI } from "../../api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import { setAppStatus } from "../../app/app-reducer";
import { ThunkErrorType } from "../../app/store";

export const login = createAsyncThunk<undefined, LoginParamsType, ThunkErrorType>(
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

export const logout = createAsyncThunk(
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

export const slice = createSlice({
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

export const authReducer = slice.reducer;
export const { setIsLoggedIn } = slice.actions;

export type AuthActionsType = SetIsLoggedInType;

export type SetIsLoggedInType = ReturnType<typeof setIsLoggedIn>;
