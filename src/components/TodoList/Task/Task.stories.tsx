import { Task } from "./Task";
import { action } from "@storybook/addon-actions";

export default {
  title: "Task",
  component: Task,
};

const callback = action("Button 'add' was pressed inside the form");

// export const BaseExample = () => {
//   return <Task />;
// };
