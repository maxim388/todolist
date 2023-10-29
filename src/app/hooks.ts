import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { AppDispatch, AppRootStateType } from "./store";
import { ActionCreatorsMapObject, bindActionCreators } from "redux";
import { useMemo } from "react";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T) {
  const dispatch = useAppDispatch();

  const boundActions = useMemo(() => {
    return bindActionCreators(actions, dispatch);
  }, []);

  return boundActions;
}
