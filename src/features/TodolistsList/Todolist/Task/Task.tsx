import { useCallback, ChangeEvent, memo, FC } from "react";
import { EditableSpan } from "../../../../components/EditableSpan/EditableSpan";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { Delete } from "@mui/icons-material";
import { TaskTypeAPI } from "../../../../api/todolists-api";
import { useActions } from "../../../../app/hooks";
import { tasksActions } from "../..";

export type TaskPropsType = {
  todolistId: string;
  task: TaskTypeAPI;
};

export const Task: FC<TaskPropsType> = memo(({ todolistId, task }) => {
  const { updateTask, removeTask } = useActions(tasksActions);

  const onRemoveHendler = () => {
    removeTask({ todolistId, taskId: task.id });
  };

  const onChangeStatusHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const status = Number(e.currentTarget.checked) ? 2 : 0;
      const param = {
        todolistId,
        taskId: task.id,
        domainModel: { status },
      };
      updateTask(param);
    },
    [todolistId, task.id]
  );

  const onChangeTitleHandler = useCallback(
    (newValue: string) => {
      const param = {
        todolistId,
        taskId: task.id,
        domainModel: { title: newValue },
      };
      updateTask(param);
    },
    [todolistId, task.id]
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
