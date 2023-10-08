import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LoginParamsType, authAPI } from "../../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { AppThunkType } from "../store";
import { setAppStatusAC } from "./app-reducer";


export type InitialStateType = {
  isLoggedIn: boolean;
};

const initialState: InitialStateType = {
  isLoggedIn: false,
};

const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(stateDraft, action: PayloadAction<{ value: boolean }>) {
      stateDraft.isLoggedIn = action.payload.value;
    },
  },
});

export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;

export const loginTC = (data: LoginParamsType): AppThunkType => {
  return async (dispatch) => {
    const { email, password, rememberMe } = data;
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await authAPI.login({ email, password, rememberMe });
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ value: true }));
        dispatch(setAppStatusAC({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};

export const logoutTC = (): AppThunkType => {
  return async (dispatch) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await authAPI.logout();
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ value: false }));
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
