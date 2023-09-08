import { Provider } from "react-redux";
import { Task } from "../../components/Task";
import { store } from "../../store/store";
import { ReduxStoreProviderDecorator } from "../../stories/ReduxStoreProviderDecorator";
import { TodoTaskPriority, TodoTaskStatus } from "../../api/todolists-api";

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
        task={{
          id: "1",
          title: "CSS",
          description: "",
          todoListId: "todolistId1",
          order: 0,
          status: TodoTaskStatus.New,
          priority: TodoTaskPriority.Later,
          startDate: "",
          deadline: "",
          addedDate: "",
        }}
      />
      <Task
        todolistId={"todolistId2"}
        task={{
          id: "2",
          title: "JS",
          description: "",
          todoListId: "todolistId1",
          order: 0,
          status: TodoTaskStatus.New,
          priority: TodoTaskPriority.Later,
          startDate: "",
          deadline: "",
          addedDate: "",
        }}
      />
    </Provider>
  );
};
