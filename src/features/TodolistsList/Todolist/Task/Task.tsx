import { useCallback, ChangeEvent, memo, FC } from "react";
import { EditableSpan } from "../../../../components/EditableSpan/EditableSpan";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { Delete } from "@mui/icons-material";
import { updateTaskTC, removeTaskTC } from "../../tasks-reducer";
import { TaskTypeAPI } from "../../../../api/todolists-api";
import { useAppDispatch } from "../../../../app/hooks";

export type TaskPropsType = {
  todolistId: string;
  task: TaskTypeAPI;
};

export const Task: FC<TaskPropsType> = memo(({ todolistId, task }) => {
  const dispatch = useAppDispatch();

  const onRemoveHendler = () => {
    dispatch(removeTaskTC({ todolistId, taskId: task.id }));
  };

  const onChangeStatusHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const param = {
        todolistId,
        taskId: task.id,
        domainModel: { status: Number(e.currentTarget.checked) },
      };
      dispatch(updateTaskTC(param));
    },
    [dispatch, todolistId, task.id]
  );

  const onChangeTitleHandler = useCallback(
    (newValue: string) => {
      const param = {
        todolistId,
        taskId: task.id,
        domainModel: { title: newValue },
      };
      dispatch(updateTaskTC(param));
    },
    [dispatch, todolistId, task.id]
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
