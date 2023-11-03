import { authSlice, asyncActions } from "./auth-reducer";
import { Login } from "./Login";
import * as authSelectors from "./selectors";

const authActions = {
  ...asyncActions,
  ...authSlice.actions,
};

const authReducer = authSlice.reducer;

export { authSelectors, Login, authActions, authReducer };
