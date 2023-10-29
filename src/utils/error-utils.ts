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
  rejectWithValue: any,
  showError = true
) => {
  if (showError) {
    const error = data.messages.length ? data.messages[0] : "Some error occurred";
    dispatch(setAppError({ error }));
  }
  dispatch(setAppStatus({ status: "failed" }));
  return rejectWithValue({ errors: data.messages, fieldsErrors: data.fieldsErrors });
};

export const handleServerNetworkError = (
  error: unknown,
  dispatch: ErrorUtilsDispatchType,
  rejectWithValue: any, //fixme
  showError = true
) => {
  if (showError) {
    // @ts-ignore  fixme
    dispatch(setAppError({ error: error.message }));
  }
  dispatch(setAppStatus({ status: "failed" }));
  let err = { errors: ["some error"], fieldsErrors: undefined };
  if (error instanceof Error && error.message) {
    return rejectWithValue({ ...err, errors: [error.message] });
  } else {
    return rejectWithValue(err);
  }
};

type ErrorUtilsDispatchType = Dispatch<SetAppStatusType | SetAppErrorType>;
