import { action } from "@storybook/addon-actions";
import { App } from "../../App";
import {
  HashRouterDecorator,
  ReduxStoreProviderDecorator,
} from "../../stories/ReduxStoreProviderDecorator";

export default {
  title: "TODOLIST/App",
  component: App,
  decorators: [ReduxStoreProviderDecorator, HashRouterDecorator],
};

export const BaseExample = () => {
  return <App demo={true} />;
};
