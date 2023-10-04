import { AppThunkType } from "../store";

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
    default:
      return state;
  }
};

export type ActionsType = SetAppStatusACType | SetAppErrorACType;

export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>;

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
  return (dispatch) => {

  };
};
