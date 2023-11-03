import { createAction } from "@reduxjs/toolkit";
import { RequestStatusType } from "../Application/application-reducer";


const setAppStatus = createAction<{ status: RequestStatusType }>("common/setAppStatus"); 
const setAppError = createAction<{ error: string | null }>("common/setAppError"); 

export type AppActionsType = ReturnType<typeof setAppStatus> | ReturnType<typeof setAppError>;

const commonActions = {
  setAppError,
  setAppStatus,
};

export { commonActions };