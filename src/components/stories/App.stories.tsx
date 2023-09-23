import { action } from "@storybook/addon-actions";
import { App } from "../../App";
import { ReduxStoreProviderDecorator } from "../../stories/ReduxStoreProviderDecorator";

export default {
  title: "TODOLIST/App",
  component: App,
  decorators: [ReduxStoreProviderDecorator],
};

const callback = action("Span wanted change value");

export const BaseExample = () => {
  return <App demo={true} />;
};
