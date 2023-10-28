import { FC, memo, useCallback, useEffect } from "react";
import { MyButton } from "../../../components/MyButton/MyButton";
import { EditableSpan } from "../../../components/EditableSpan/EditableSpan";
import Button from "@mui/material/Button";
import { Delete } from "@mui/icons-material";
import { Task } from "./Task/Task";
import { FilterValuesType, TodolistDomainType } from "../todolists-reducer";
import { AddItemForm } from "../../../components/AddItemForm/AddItemForm";
import { TodoTaskStatus } from "../../../api/todolists-api";
import { useActions, useAppSelector } from "../../../app/hooks";
import { tasksActions, todolistsActions } from "..";

export type TodolistPropsType = {
  todolist: TodolistDomainType;
  arrTitleFilter: FilterValuesType[];
};

export const Todolist: FC<TodolistPropsType> = memo(
  ({ todolist, arrTitleFilter }) => {
    const tasks = useAppSelector((state) => state.tasks[todolist.id]);
    const { addTask, fetchTasks } = useActions(tasksActions);
    const { changeTodolistFilter, changeTodolistTitle, removeTodolist } =
      useActions(todolistsActions);

    useEffect(() => {
      fetchTasks({ todolistId: todolist.id });
    }, [todolist.id]);

    const onRemoveTodolist = useCallback(() => {
      removeTodolist({ todolistId: todolist.id });
    }, [todolist.id]);

    const onChangeTodolistTitle = useCallback(
      (newTodolistTitle: string) => {
        const param = { todolistId: todolist.id, title: newTodolistTitle };
        changeTodolistTitle(param);
      },
      [todolist.id]
    );

    const addItem = useCallback(
      (taskTitle: string) => {
        addTask({ todolistId: todolist.id, taskTitle });
      },
      [todolist.id]
    );

    const changeFilter = useCallback(
      (filter: FilterValuesType, todolistId: string) => {
        changeTodolistFilter({ todolistId, filter });
      },
      []
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
      <div>
        <h3>
          <EditableSpan
            title={todolist.title}
            onChange={onChangeTodolistTitle}
          />
          <Button
            onClick={onRemoveTodolist}
            disabled={todolist.entityStatus === "loading"}
            startIcon={<Delete />}
          ></Button>
        </h3>
        <AddItemForm
          addItem={addItem}
          disabled={todolist.entityStatus === "loading"}
        />
        <div>
          {tasksForTodolist.map((t) => {
            return <Task key={t.id} todolistId={todolist.id} task={t} />;
          })}
        </div>
        <div>
          {arrTitleFilter.map((t) => {
            return (
              <MyButton
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
  }
);
