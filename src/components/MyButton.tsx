import { FilterValuesType } from "../App";
import { Button, IconButton } from "@mui/material";

export type ButtonPropsType = {
  id: string;
  title: FilterValuesType;
  filter: FilterValuesType;
  disabled?: boolean;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
};

export function MyButton(props: ButtonPropsType) {

  const onAllClickHandler = () => props.changeFilter(props.title, props.id);

  return (
    <Button
      onClick={onAllClickHandler}
      disabled={props.disabled}
      className={props.filter === props.title ? "active-filter" : ""}
      variant={props.filter === props.title ? "contained" : undefined}
      // color={"secondary"}
    >
      {props.title}
    </Button>
  );
}
