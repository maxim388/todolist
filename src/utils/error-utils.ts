import { Dispatch } from "redux";
import {
  SetAppErrorACType,
  SetAppStatusACType,
  setAppErrorAC,
  setAppStatusAC,
} from "../store/reducers/app-reducer";
import { ResponseType } from "../api/todolists-api";

export const handleServerAppError = <T>(
  data: ResponseType<T>,
  dispatch: ErrorUtilsDispatchType
) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC({ error: data.messages[0] }));
  } else {
    dispatch(setAppErrorAC({ error: "Some error occurred" }));
  }
  dispatch(setAppStatusAC({ status: "failed" }));
};

export const handleServerNetworkError = (
  error: unknown,
  dispatch: ErrorUtilsDispatchType
) => {
  if (error instanceof Error && error.message) {
    // fix
    dispatch(setAppErrorAC({ error: error.message }));
  }
  dispatch(setAppStatusAC({ status: "failed" }));
};

type ErrorUtilsDispatchType = Dispatch<SetAppStatusACType | SetAppErrorACType>;
