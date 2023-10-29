import { FC, memo, useCallback, useEffect } from "react";
import { FilterButton } from "../../../components/FilterButton/FilterButton";
import { EditableSpan } from "../../../components/EditableSpan/EditableSpan";
import Button from "@mui/material/Button";
import { Delete } from "@mui/icons-material";
import { Task } from "./Task/Task";
import { FilterValuesType, TodolistDomainType } from "../todolists-reducer";
import {
  AddItemForm,
  AddItemFormSubmitHelperType,
} from "../../../components/AddItemForm/AddItemForm";
import { TodoTaskStatus } from "../../../api/todolists-api";
import { useActions, useAppDispatch, useAppSelector } from "../../../app/hooks";
import { tasksActions, todolistsActions } from "..";

export type TodolistPropsType = {
  todolist: TodolistDomainType;
  arrTitleFilter: FilterValuesType[];
};

export const Todolist: FC<TodolistPropsType> = memo(({ todolist, arrTitleFilter }) => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks[todolist.id]);
  const { fetchTasks } = useActions(tasksActions);
  const { changeTodolistFilter, changeTodolistTitle, removeTodolist } =
    useActions(todolistsActions);

  useEffect(() => {
    fetchTasks({ todolistId: todolist.id });
  }, [fetchTasks, todolist.id]);

  const onRemoveTodolist = useCallback(() => {
    removeTodolist({ todolistId: todolist.id });
  }, [removeTodolist, todolist.id]);

  const onChangeTodolistTitle = useCallback(
    (newTodolistTitle: string) => {
      const param = { todolistId: todolist.id, title: newTodolistTitle };
      changeTodolistTitle(param);
    },
    [changeTodolistTitle, todolist.id]
  );

  const addItem = useCallback(
    async (taskTitle: string, helper?: AddItemFormSubmitHelperType) => {
      const thunk = tasksActions.addTask({ todolistId: todolist.id, taskTitle });
      const resultAction = await dispatch(thunk);
      if (tasksActions.addTask.rejected.match(resultAction)) {
        if (resultAction.payload?.errors.length) {
          const errorMessage = resultAction.payload?.errors[0];
          helper?.setError(errorMessage);
        } else {
          helper?.setError("Some error occured");
        }
      } else {
        helper?.setTitle("");
      }
    },
    [dispatch, todolist.id]
  );

  const changeFilter = useCallback(
    (todolistId: string, filter: FilterValuesType) => {
      changeTodolistFilter({ todolistId, filter });
    },
    [changeTodolistFilter]
  );

  let tasksForTodolist = tasks;
  if (todolist.filter === "Completed") {
    tasksForTodolist = tasks.filter((t) => {
      return t.status === TodoTaskStatus.Completed;
    });
  }
  if (todolist.filter === "Active") {
    tasksForTodolist = tasks.filter((t) => t.status === TodoTaskStatus.New);
  }
  return (
    // fixme style={{position: "relative"}} and  style={{ position: "absolute", right: "5px", top: "-20px" }}
    <div style={{ position: "relative" }}>
      <h3>
        <EditableSpan title={todolist.title} onChange={onChangeTodolistTitle} />
        <Button
          onClick={onRemoveTodolist}
          disabled={todolist.entityStatus === "loading"}
          startIcon={<Delete fontSize={"small"}/>}
          style={{ position: "absolute", right: "5px", top: "-20px" }}
          size={"small"}
        ></Button>
      </h3>
      <AddItemForm addItem={addItem} disabled={todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => {
          return <Task key={t.id} todolistId={todolist.id} task={t} />;
        })}
        {!tasksForTodolist.length && (
          <span style={{ padding: "10px", color: "grey" }}>No task</span>
        )}
      </div>
      <div>
        {arrTitleFilter.map((t) => {
          return (
            <FilterButton
              key={t}
              title={t}
              id={todolist.id}
              changeFilter={changeFilter}
              filter={todolist.filter}
            />
          );
        })}
      </div>
    </div>
  );
});
