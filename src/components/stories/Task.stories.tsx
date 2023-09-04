import { Provider } from "react-redux";
import { Task } from "../../components/Task";
import { store } from "../../store/store";
import { ReduxStoreProviderDecorator } from "../../stories/ReduxStoreProviderDecorator";

export default {
  title: "TODOLIST/Task",
  component: Task,
  decorators: [ReduxStoreProviderDecorator],
};

export const BaseExample = () => {
  return (
    <Provider store={store}>
      <Task
        todolistId={"todolistId1"}
        task={{ id: "1", isDone: true, title: "CSS" }}
      />
      <Task
        todolistId={"todolistId2"}
        task={{ id: "2", isDone: false, title: "JS" }}
      />
    </Provider>
  );
};
