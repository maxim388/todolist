import React, { useCallback, ChangeEvent, memo } from "react";
import { EditableSpan } from "./EditableSpan";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { Delete } from "@mui/icons-material";
import { TaskType } from "../App";
import { useDispatch } from "react-redux";
import {
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
} from "../reducers/tasks-reducer";

export type TaskPropsType = {
  todolistId: string;
  task: TaskType;
};

export const Task = memo(({ task, todolistId }: TaskPropsType) => {
  const dispatch = useDispatch();

  const onRemoveHendler = () => dispatch(removeTaskAC(task.id, todolistId));

  const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(changeTaskStatusAC(task.id, e.currentTarget.checked, todolistId));
  };

  const onChangeTitleHandler = useCallback(
    (newValue: string) => {
      dispatch(changeTaskTitleAC(task.id, newValue, todolistId));
    },
    [dispatch, task.id, todolistId]
  );

  return (
    <div key={task.id} className={task.isDone ? "is-done" : ""}>
      <Checkbox
        checked={task.isDone}
        onChange={(e) => onChangeStatusHandler(e)}
      />
      <EditableSpan title={task.title} onChange={onChangeTitleHandler} />
      <Button onClick={onRemoveHendler} startIcon={<Delete />}></Button>
    </div>
  );
});
