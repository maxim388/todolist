import { Dispatch } from "redux";
import {
  SetAppErrorType,
  SetAppStatusType,
  setAppError,
  setAppStatus,
} from "../app/app-reducer";
import { ResponseType } from "../api/todolists-api";

export const handleServerAppError = <T>(
  data: ResponseType<T>,
  dispatch: ErrorUtilsDispatchType,
  showError = true
) => {
  if (showError) {
    const error = data.messages.length ? data.messages[0] : "Some error occurred";
    dispatch(setAppError({ error }));
  }
  dispatch(setAppStatus({ status: "failed" }));
};

export const handleServerNetworkError = (
  error: unknown,
  dispatch: ErrorUtilsDispatchType,
  showError = true
) => {
  if (showError) {
    // @ts-ignore  fixme
    dispatch(setAppError({ error: error.message }));
  }
  dispatch(setAppStatus({ status: "failed" }));
};

type ErrorUtilsDispatchType = Dispatch<SetAppStatusType | SetAppErrorType>;
