const SET_APP_STATUS = "SET_APP_STATUS";
const SET_APP_ERROR = "SET_APP_ERROR";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

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
