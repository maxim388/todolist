import { useCallback, ChangeEvent, memo, FC } from "react";
import { EditableSpan } from "./EditableSpan";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { Delete } from "@mui/icons-material";
import {
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskTC,
} from "../reducers/tasks-reducer";
import { TaskTypeAPI } from "../api/todolists-api";
import { useAppDispatch } from "../app/hooks";

export type TaskPropsType = {
  todolistId: string;
  task: TaskTypeAPI;
};

export const Task: FC<TaskPropsType> = memo(({ todolistId, task }) => {
  const dispatch = useAppDispatch();

  const onRemoveHendler = () => {
    dispatch(removeTaskTC(todolistId, task.id));
  };

  const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = Number(e.currentTarget.checked);
    dispatch(changeTaskStatusAC(todolistId, task.id, checked));
  };

  const onChangeTitleHandler = useCallback(
    (newValue: string) => {
      dispatch(changeTaskTitleAC(todolistId, task.id, newValue));
    },
    [dispatch, task.id, todolistId]
  );

  return (
    <div key={task.id} className={task.status ? "is-done" : ""}>
      <Checkbox
        checked={Boolean(task.status)}
        onChange={(e) => onChangeStatusHandler(e)}
      />
      <EditableSpan title={task.title} onChange={onChangeTitleHandler} />
      <Button onClick={onRemoveHendler} startIcon={<Delete />}></Button>
    </div>
  );
});
