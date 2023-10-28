import { FC, memo, useCallback, useEffect } from "react";
import { MyButton } from "../../../components/MyButton/MyButton";
import { EditableSpan } from "../../../components/EditableSpan/EditableSpan";
import Button from "@mui/material/Button";
import { Delete } from "@mui/icons-material";
import { Task } from "./Task/Task";
import {
  FilterValuesType,
  TodolistDomainType,
  changeTodolistFilterTC,
  changeTodolistTitleTC,
  removeTodolistTC,
} from "../todolists-reducer";
import { addTaskTC, fetchTasksTC } from "../tasks-reducer";
import { AddItemForm } from "../../../components/AddItemForm/AddItemForm";
import { TodoTaskStatus } from "../../../api/todolists-api";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

export type TodolistPropsType = {
  todolist: TodolistDomainType;
  arrTitleFilter: FilterValuesType[];
  demo?: boolean;
};

export const Todolist: FC<TodolistPropsType> = memo(
  ({ todolist, arrTitleFilter, demo }) => {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector((state) => state.tasks[todolist.id]);

    useEffect(() => {
      // if (demo) return; //clean in build
      dispatch(fetchTasksTC({ todolistId: todolist.id }));
    }, [dispatch, todolist.id, demo]);

    const removeTodolist = useCallback(() => {
      dispatch(removeTodolistTC({ todolistId: todolist.id }));
    }, [dispatch, todolist.id]);

    const changeTodolistTitle = useCallback(
      (newTodolistTitle: string) => {
        const param = { todolistId: todolist.id, title: newTodolistTitle };
        dispatch(changeTodolistTitleTC(param));
      },
      [dispatch, todolist.id]
    );

    const addTask = useCallback(
      (taskTitle: string) => {
        dispatch(addTaskTC({ todolistId: todolist.id, taskTitle }));
      },
      [dispatch, todolist.id]
    );

    const changeFilter = useCallback(
      (filter: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilterTC({todolistId, filter}));
      },
      [dispatch]
    );

    let tasksForTodolist = tasks;
    if (todolist.filter === "Completed") {
      tasksForTodolist = tasks.filter(
        (t) => t.status === TodoTaskStatus.Completed
      );
    }
    if (todolist.filter === "Active") {
      tasksForTodolist = tasks.filter((t) => t.status === TodoTaskStatus.New);
    }
    return (
      <div>
        <h3>
          <EditableSpan title={todolist.title} onChange={changeTodolistTitle} />
          <Button
            onClick={removeTodolist}
            disabled={todolist.entityStatus === "loading"}
            startIcon={<Delete />}
          ></Button>
        </h3>
        <AddItemForm
          addItem={addTask}
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
