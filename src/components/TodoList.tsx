import React, { memo, useCallback, useEffect } from "react";
import { MyButton } from "./MyButton";
import { EditableSpan } from "./EditableSpan";
import Button from "@mui/material/Button";
import { Delete } from "@mui/icons-material";
import { Task } from "./Task";
import { useSelector } from "react-redux";
import { AppRootStateType } from "../store/store";
import { useDispatch } from "react-redux";
import {
  FilterValuesType,
  TodolistDomainType,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  removeTodolistAC,
} from "../reducers/todolists-reducer";
import { addTaskAC, fetchTasksTC } from "../reducers/tasks-reducer";
import { AddItemForm } from "./AddItemForm";
import { TaskTypeAPI, TodoTaskStatus } from "../api/todolists-api";
import { useAppDispatch } from "../app/hooks";

export type TodolistPropsType = {
  todolist: TodolistDomainType;
  arrTitleFilter: FilterValuesType[];
};

export const Todolist = memo(
  ({ todolist, arrTitleFilter }: TodolistPropsType) => {
    // const dispatch = useDispatch();
    const dispatch = useAppDispatch();
    const tasks = useSelector<AppRootStateType, TaskTypeAPI[]>(
      (state) => state.tasks[todolist.id]
    );

    useEffect(() => {
      dispatch(fetchTasksTC(todolist.id));
    }, [dispatch]);

    const removeTodolist = useCallback(() => {
      dispatch(removeTodolistAC(todolist.id));
    }, [dispatch, todolist.id]);

    const changeTodolistTitle = useCallback(
      (newTodolistTitle: string) => {
        dispatch(changeTodolistTitleAC(newTodolistTitle, todolist.id));
      },
      [dispatch, todolist.id]
    );

    const addTask = useCallback(
      (taskTitle: string) => {
        dispatch(addTaskAC(taskTitle, todolist.id));
      },
      [dispatch, todolist.id]
    );

    const changeFilter = useCallback(
      (filter: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilterAC(filter, todolistId));
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
