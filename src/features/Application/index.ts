import { appSlice } from "./application-reducer";
import { asyncActions as appAsyncActions } from "./application-reducer";
import * as appSelectors from "./selectors";

const appActions = {
  ...appAsyncActions, 
  ...appSlice.actions,
};

const appReducer = appSlice.reducer;

export { appSelectors, appReducer, appActions };
