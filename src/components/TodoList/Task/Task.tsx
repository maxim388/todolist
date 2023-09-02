import React, { useCallback, ChangeEvent, memo } from "react";
import { EditableSpan } from "../../EditableSpan/EditableSpan";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { Delete } from "@mui/icons-material";
import { TaskType } from "../../../App";
import { useDispatch } from "react-redux";
import {
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
} from "../../../reducers/tasks-reducer";

export type TaskPropsType = {
  todolistId: string;
  task: TaskType;
  // removeTask: (taskId: string, todolistId: string) => void;
  // changeTaskStatus: (task: string, isBone: boolean, todolistId: string) => void;
  // changeTaskTitle: (task: string, newTitle: string, todolistId: string) => void;
};

export const Task = memo(
  ({
    // removeTask,
    // changeTaskStatus,
    // changeTaskTitle,
    task,
    todolistId,
  }: TaskPropsType) => {
    const dispatch = useDispatch();

    // const removeTask = useCallback(
    //   (taskId: string, todolistId: string) => {
    //     dispatch(removeTaskAC(taskId, todolistId));
    //   },
    //   [dispatch]
    // );

    const onRemoveHendler = () => dispatch(removeTaskAC(task.id, todolistId));

    // const changeTaskStatus = useCallback(
    //   (taskId: string, isDone: boolean, todolistId: string) => {
    //     dispatch(changeTaskStatusAC(taskId, isDone, todolistId));
    //   },
    //   [dispatch]
    // );

    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        changeTaskStatusAC(task.id, e.currentTarget.checked, todolistId)
      );
    };

    //     const changeTaskTitle = useCallback(
    //   (taskId: string, newTitle: string, todolistId: string) => {
    //     dispatch(changeTaskTitleAC(taskId, newTitle, todolistId));
    //   },
    //   [dispatch]
    // );

    const onChangeTitleHandler = (newValue: string) => {
      dispatch(changeTaskTitleAC(task.id, newValue, todolistId));
    };

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
