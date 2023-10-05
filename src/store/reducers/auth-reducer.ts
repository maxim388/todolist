import { LoginParamsType, authAPI } from "../../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { AppThunkType } from "../store";
import { setAppStatusAC } from "./app-reducer";

const SET_IS_LOGGED_IN = "auth/SET_IS_LOGGED_IN";

export type InitialStateType = {
  isLoggedIn: boolean;
};

const initialState: InitialStateType = {
  isLoggedIn: false,
};

export const authReducer = (
  state: InitialStateType = initialState,
  action: AuthActionsType
): InitialStateType => {
  switch (action.type) {
    case SET_IS_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: action.value,
      };
    default:
      return state;
  }
};

export type AuthActionsType = SetIsLoggedInACType;

export type SetIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>;

export const setIsLoggedInAC = (value: boolean) => {
  return {
    type: SET_IS_LOGGED_IN,
    value,
  } as const;
};

export const loginTC = (data: LoginParamsType): AppThunkType => {
  return async (dispatch) => {
    const { email, password, rememberMe } = data;
    try {
      dispatch(setAppStatusAC("loading"));
      const res = await authAPI.login({ email, password, rememberMe });
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
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
      dispatch(setAppStatusAC("loading"));
      const res = await authAPI.logout();
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};
