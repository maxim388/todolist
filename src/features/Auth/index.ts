import { slice } from './auth-reducer';
import { asyncActions } from './auth-reducer';
import { Login } from './Login';
import * as authSelectors from "./selectors";

const authActions = {
    ...asyncActions,
    ...slice.actions
}

export { authSelectors, Login, authActions };
