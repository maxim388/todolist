import { AppThunkType } from "../store";

const SET_STATUS = "App/SET_STATUS";
const SET_ERROR = "App/SET_ERROR";

type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

export type InitialStateType = {
  status: RequestStatusType;
  error: string | null;
};

const initialState: InitialStateType = {
  status: "loading",
  error: null,
};

export const appReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case SET_STATUS:
      return { ...state, status: action.status };
    case SET_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};

export type ActionsType = SetStatusACType | SetErrorACType;

type SetStatusACType = ReturnType<typeof setStatusAC>;
export type SetErrorACType = ReturnType<typeof setErrorAC>;

export const setStatusAC = (status: RequestStatusType) => {
  return {
    type: SET_STATUS,
    status,
  } as const;
};
export const setErrorAC = (error: string | null) => {
  return {
    type: SET_ERROR,
    error,
  } as const;
};

export const processingErrorTC = (e: unknown): AppThunkType => {
  return (dispatch) => {
    if (e instanceof Error && e.message) {
      dispatch(setErrorAC(e.message));
    } else {
      dispatch(setErrorAC("Some error occurred"));
      console.log(e);
    }
    dispatch(setStatusAC("failed"));
  };
};
