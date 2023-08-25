import React, { useCallback, ChangeEvent } from "react";
import { TaskType } from "../App";
import { EditableSpan } from "./EditableSpan";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { Delete } from "@mui/icons-material";

export type TaskPropsType = {
  todolistId: string;
  task: TaskType;
  removeTask: (taskId: string, todolistId: string) => void;
  changeTaskStatus: (task: string, isBone: boolean, todolistId: string) => void;
  changeTaskTitle: (task: string, newTitle: string, todolistId: string) => void;
};

export const Task = React.memo(
  ({
    removeTask,
    changeTaskStatus,
    changeTaskTitle,
    task,
    todolistId,
  }: TaskPropsType) => {

    console.log("Task");

    const onRemoveHendler = useCallback(
      () => removeTask(task.id, todolistId),
      [task.id, todolistId]
    );

    const onChangeStatusHandler = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(task.id, e.currentTarget.checked, todolistId);
      },
      [changeTaskStatus, task.id, todolistId]
    );
    const onChangeTitleHandler = useCallback(
      (newValue: string) => {
        changeTaskTitle(task.id, newValue, todolistId);
      },
      [changeTaskTitle, task.id, todolistId]
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
  }
);
