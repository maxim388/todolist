import { useCallback, ChangeEvent, memo, FC } from "react";
import { EditableSpan } from "../../../../components/EditableSpan/EditableSpan";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { Delete } from "@mui/icons-material";
import { TaskAPIType } from "../../../../api/types";
import { useActions } from "../../../../utils/redux-utils";
import { tasksActions } from "../..";

export type TaskPropsType = {
  todolistId: string;
  task: TaskAPIType;
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
    [updateTask, todolistId, task.id]
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
    [updateTask, todolistId, task.id]
  );

  return (
    <div
      key={task.id}
      className={task.status ? "is-done" : ""}
      style={{ position: "relative" }}
    >
      <Checkbox checked={Boolean(task.status)} onChange={(e) => onChangeStatusHandler(e)} />
      <EditableSpan title={task.title} onChange={onChangeTitleHandler} />
      <Button
        onClick={onRemoveHendler}
        startIcon={<Delete fontSize={"small"} />}
        style={{ position: "absolute", top: "2px", right: "2px" }}
      ></Button>
    </div>
  );
});
