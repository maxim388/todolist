import { AddItemForm } from "./AddItemForm";
import { action } from "@storybook/addon-actions";

export default {
  title: "TODOLIST/AddItemForm",
  component: AddItemForm,
};
const asyncCallback = async (...params: any[]) => {
  action("Button 'add' was pressed inside the form")(...params);
};

export const BaseExample = () => {
  return <AddItemForm addItem={asyncCallback} />;
};
