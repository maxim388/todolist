import ReactDOM from "react-dom/client";
import { AppWithRedux } from "./AppWithRedux";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AppWithReducers } from "./AppWithReducers";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <AppWithRedux />
   </Provider>
);
