import { FC, memo, useCallback, useEffect } from "react";
import { MyButton } from "./MyButton";
import { EditableSpan } from "./EditableSpan";
import Button from "@mui/material/Button";
import { Delete } from "@mui/icons-material";
import { Task } from "./Task";
import {
  FilterValuesType,
  TodolistDomainType,
  changeTodolistFilterTC,
  changeTodolistTitleTC,
  removeTodolistTC,
} from "../reducers/todolists-reducer";
import { addTaskTC, fetchTasksTC } from "../reducers/tasks-reducer";
import { AddItemForm } from "./AddItemForm";
import { TodoTaskStatus } from "../api/todolists-api";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";

export type TodolistPropsType = {
  todolist: TodolistDomainType;
  arrTitleFilter: FilterValuesType[];
};

export const Todolist: FC<TodolistPropsType> = memo(
  ({ todolist, arrTitleFilter }) => {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector((state) => state.tasks[todolist.id]);

    useEffect(() => {
      dispatch(fetchTasksTC(todolist.id));
    }, [dispatch, todolist.id]);

    const removeTodolist = useCallback(() => {
      dispatch(removeTodolistTC(todolist.id));
    }, [dispatch, todolist.id]);

    const changeTodolistTitle = useCallback(
      (newTodolistTitle: string) => {
        dispatch(changeTodolistTitleTC(todolist.id, newTodolistTitle));
      },
      [dispatch, todolist.id]
    );

    const addTask = useCallback(
      (taskTitle: string) => {
        dispatch(addTaskTC(todolist.id, taskTitle));
      },
      [dispatch, todolist.id]
    );

    const changeFilter = useCallback(
      (filter: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilterTC(todolistId, filter));
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
          <Button onClick={removeTodolist} startIcon={<Delete />}></Button>
        </h3>
        <AddItemForm addItem={addTask} />
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
