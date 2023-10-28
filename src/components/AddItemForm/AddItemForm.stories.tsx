import { AddItemForm } from "./AddItemForm";
import { action } from "@storybook/addon-actions";

export default {
  title: "TODOLIST/AddItemForm",
  component: AddItemForm,
};

const callback = action("Button 'add' was pressed inside the form");

export const BaseExample = () => {
  return <AddItemForm addItem={callback} />;
};
