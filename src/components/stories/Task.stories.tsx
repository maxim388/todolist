import { Provider } from "react-redux";
import { Task } from "../../components/Task";
import { todolistId1 } from "../../reducers/todolists-reducer";
import { action } from "@storybook/addon-actions";
import { store } from "../../store/store";

export default {
  title: "Task",
  component: Task,
};

// const callback = action("Button 'add' was pressed inside the form");

export const BaseExample = () => {
  return (
    <Provider store={store}>
      <Task
        todolistId={todolistId1}
        task={{ id: "1", isDone: true, title: "CSS" }}
      />
      <Task
        todolistId={todolistId1}
        task={{ id: "2", isDone: false, title: "JS" }}
      />
    </Provider>
  );
};
