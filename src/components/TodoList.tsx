import React, { memo, useCallback } from "react";
import { FilterValuesType, TaskType, TodolistType } from "../AppWithRedux";
import { MyButton } from "./MyButton";
import { AddItemForm } from "./AddItemForm";
import { EditableSpan } from "./EditableSpan";
import Button from "@mui/material/Button";
import { Delete } from "@mui/icons-material";
import { Task } from "./Task";
import { useSelector } from "react-redux";
import { AppRootStateType } from "../store/store";
import { useDispatch } from "react-redux";
import {
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  removeTodolistAC,
} from "../reducers/todolists-reducer";
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
} from "../reducers/tasks-reducer";

export type TodolistPropsType = {
  todolist: TodolistType;
  arrTitleFilter: Array<FilterValuesType>;
};

export const Todolist = memo(
  ({ todolist, arrTitleFilter }: TodolistPropsType) => {
    const dispatch = useDispatch();
    const tasks = useSelector<AppRootStateType, TaskType[]>(
      (state) => state.tasks[todolist.id]
    );

    const removeTodolist = useCallback(() => {
      dispatch(removeTodolistAC(todolist.id));
    }, [dispatch, todolist.id]);

    const changeTodolistTitle = useCallback(
      (newTodolistTitle: string) => {
        dispatch(changeTodolistTitleAC(newTodolistTitle, todolist.id));
      },
      [dispatch, todolist.id]
    );

    const addTask = useCallback(() => {
      dispatch(addTaskAC(todolist.title, todolist.id));
    }, [dispatch, todolist.title, todolist.id]);

    const removeTask = useCallback(
      (taskId: string, todolistId: string) => {
        dispatch(removeTaskAC(taskId, todolistId));
      },
      [dispatch]
    );

    const changeTaskStatus = useCallback(
      (taskId: string, isDone: boolean, todolistId: string) => {
        dispatch(changeTaskStatusAC(taskId, isDone, todolistId));
      },
      [dispatch]
    );

    const changeFilter = useCallback(
      (filter: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilterAC(filter, todolistId));
      },
      [dispatch]
    );

    const changeTaskTitle = useCallback(
      (taskId: string, newTitle: string, todolistId: string) => {
        dispatch(changeTaskTitleAC(taskId, newTitle, todolistId));
      },
      [dispatch]
    );

    let tasksForTodolist = tasks;
    if (todolist.filter === "Completed") {
      tasksForTodolist = tasks.filter((t) => t.isDone);
    }
    if (todolist.filter === "Active") {
      tasksForTodolist = tasks.filter((t) => !t.isDone);
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
            return (
              <Task
                key={t.id}
                todolistId={todolist.id}
                removeTask={removeTask}
                task={t}
                changeTaskStatus={changeTaskStatus}
                changeTaskTitle={changeTaskTitle}
              />
            );
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
