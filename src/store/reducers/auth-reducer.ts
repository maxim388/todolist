import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FieldErrorType, LoginParamsType, authAPI } from "../../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { AppThunkType } from "../store";
import { setAppStatusAC } from "./app-reducer";

export const loginTC = createAsyncThunk<
  { isLoggedIn: boolean },
  LoginParamsType,
  { rejectValue: { errors: string[]; fieldsErrors?: FieldErrorType[]} }
>("auth/login", async (param, thunkAPI) => {
  const { email, password, rememberMe } = param;
  try {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
    const res = await authAPI.login({ email, password, rememberMe });
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      });
    }
  } catch (error) {
    handleServerNetworkError(error, thunkAPI.dispatch);
    if (error instanceof Error && error.message) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      });
    } else {
      return thunkAPI.rejectWithValue({
        errors: ["some error"],
        fieldsErrors: undefined,
      });
    }
  }
});

const slice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false },
  reducers: {
    setIsLoggedInAC(
      stateDraft,
      action: PayloadAction<{ isLoggedIn: boolean }>
    ) {
      stateDraft.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginTC.fulfilled, (stateDraft, action) => {
      stateDraft.isLoggedIn = action.payload.isLoggedIn;
    });
  },
});

export const authReducer = slice.reducer;
export const { setIsLoggedInAC } = slice.actions;

export const logoutTC = (): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await authAPI.logout();
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ isLoggedIn: false }));
        dispatch(setAppStatusAC({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};

export type AuthActionsType = SetIsLoggedInACType;

export type SetIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>;
