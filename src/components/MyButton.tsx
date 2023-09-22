import { Button } from "@mui/material";
import { FilterValuesType } from "../reducers/todolists-reducer";
import { FC, memo } from "react";

export type ButtonPropsType = {
  id: string;
  title: FilterValuesType;
  filter: FilterValuesType;
  disabled?: boolean;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
};

export const MyButton: FC<ButtonPropsType> = memo((props) => {
  const onAllClickHandler = () => props.changeFilter(props.title, props.id);

  return (
    <Button
      onClick={onAllClickHandler}
      disabled={props.disabled}
      className={props.filter === props.title ? "active-filter" : ""}
      variant={props.filter === props.title ? "contained" : undefined}
    >
      {props.title}
    </Button>
  );
});
