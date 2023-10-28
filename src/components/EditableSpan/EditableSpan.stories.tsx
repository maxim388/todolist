import { action } from "@storybook/addon-actions";
import { EditableSpan } from "./EditableSpan";

export default {
  title: "TODOLIST/EditableSpan",
  component: EditableSpan,
};

const callback = action("Span wanted change value");

export const BaseExample = () => {
  return (
      <EditableSpan onChange={callback} title={"start value"}/>
  );
};
