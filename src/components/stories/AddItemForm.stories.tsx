import { AddItemForm } from "../../components/AddItemForm";
import { action } from "@storybook/addon-actions";

export default {
  title: "AddItemForm",
  component: AddItemForm,
  
};

const callback = action("Button 'add' was pressed inside the form");

export const BaseExample = () => {
  return <AddItemForm addItem={callback} />;
};
