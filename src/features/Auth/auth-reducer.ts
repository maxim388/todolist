import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  FieldErrorType,
  LoginParamsType,
  authAPI,
} from "../../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { setAppStatusAC } from "../../app/app-reducer";

export const login = createAsyncThunk<
  undefined,
  LoginParamsType,
  { rejectValue: { errors: string[]; fieldsErrors?: FieldErrorType[] } }
>("auth/login", async (param, { dispatch, rejectWithValue }) => {
  const { email, password, rememberMe } = param;
  try {
    dispatch(setAppStatusAC({ status: "loading" }));
    const res = await authAPI.login({ email, password, rememberMe });
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({ status: "succeeded" }));
      return;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      });
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    //fix
    let err = { errors: ["some error"], fieldsErrors: undefined };
    if (error instanceof Error && error.message) {
      return rejectWithValue({ ...err, errors: [error.message] });
    } else {
      return rejectWithValue(err);
    }
  }
});

export const logout = createAsyncThunk(
  "auth/logout",
  async (param, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await authAPI.logout();
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({ status: "succeeded" }));
        return { isLoggedIn: false };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue({
          errors: res.data.messages,
          fieldsErrors: res.data.fieldsErrors,
        });
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      //fix_me
      let err = { errors: ["some error"], fieldsErrors: undefined };
      if (error instanceof Error && error.message) {
        return rejectWithValue({ ...err, errors: [error.message] });
      } else {
        return rejectWithValue(err);
      }
    }
  }
);

const slice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false },
  reducers: {
    setIsLoggedIn(
      stateDraft,
      action: PayloadAction<{ isLoggedIn: boolean }>
    ) {
      stateDraft.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (stateDraft, action) => {
      stateDraft.isLoggedIn = true;
    });
    builder.addCase(logout.fulfilled, (stateDraft, action) => {
      stateDraft.isLoggedIn = false;
    });
  },
});

export const authReducer = slice.reducer;
export const { setIsLoggedIn } = slice.actions;

export type AuthActionsType = SetIsLoggedInType;

export type SetIsLoggedInType = ReturnType<typeof setIsLoggedIn>;
 