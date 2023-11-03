import { Button } from "@mui/material";
import { FilterValuesType } from "../../features/TodolistsList/todolists-reducer";
import { FC, memo, useCallback } from "react";

export type ButtonPropsType = {
  id: string;
  title: FilterValuesType;
  filter: FilterValuesType;
  disabled?: boolean;
  changeFilter: (todolistId: string, value: FilterValuesType) => void;
};

export const FilterButton: FC<ButtonPropsType> = memo(
  ({ id, title, filter, disabled, changeFilter }) => {
    const onAllClickHandler = useCallback(
      () => changeFilter(id, title),
      [id, title, changeFilter]
    );

    return (
      <Button
        onClick={onAllClickHandler}
        disabled={disabled}
        className={filter === title ? "active-filter" : ""}
        variant={filter === title ? "contained" : undefined}
      >
        {title}
      </Button>
    );
  }
);
