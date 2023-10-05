import { authAPI } from "../../api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import { AppThunkType } from "../store";
import { setIsLoggedInAC } from "./auth-reducer";

const SET_APP_STATUS = "app/SET_APP_STATUS";
const SET_APP_ERROR = "app/SET_APP_ERROR";
const SET_APP_INITIALIZED = "app/SET_APP_INITIALIZED";

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

export const appReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case SET_APP_STATUS:
      return { ...state, status: action.status };
    case SET_APP_ERROR:
      return { ...state, error: action.error };
    case SET_APP_INITIALIZED:
      return {
        ...state,
        isInitialized: action.value,
      };
    default:
      return state;
  }
};

export type ActionsType =
  | SetAppStatusACType
  | SetAppErrorACType
  | SetAppInitializedACType;

export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>;
export type SetAppInitializedACType = ReturnType<typeof setAppInitializedAC>;

export const setAppStatusAC = (status: RequestStatusType) => {
  return {
    type: SET_APP_STATUS,
    status,
  } as const;
};
export const setAppErrorAC = (error: string | null) => {
  return {
    type: SET_APP_ERROR,
    error,
  } as const;
};
export const setAppInitializedAC = (value: boolean) => {
  return {
    type: SET_APP_INITIALIZED,
    value,
  } as const;
};

export const initializeAppTC = (): AppThunkType => {
  return async (dispatch) => {
    try {
      const res = await authAPI.me()
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
      } else {
        handleServerAppError(res.data, dispatch);
      }
      dispatch(setAppInitializedAC(true));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
};
