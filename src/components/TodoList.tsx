import React, { useCallback, ChangeEvent } from "react";
import { FilterValuesType, TaskType } from "../App";
import { MyButton } from "./MyButton";
import { AddItemForm } from "./AddItemForm";
import { EditableSpan } from "./EditableSpan";
import Button from "@mui/material/Button";
import { Delete } from "@mui/icons-material";
import { Task } from "./Task";

export type TodolistPropsType = {
  id: string;
  title: string;
  tasks: Array<TaskType>;
  arrTitleFilter: Array<FilterValuesType>;
  filter: FilterValuesType;
  removeTask: (taskId: string, todolistId: string) => void;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  addTask: (title: string, todolistId: string) => void;
  changeTaskStatus: (task: string, isBone: boolean, todolistId: string) => void;
  changeTaskTitle: (task: string, newTitle: string, todolistId: string) => void;
  changeTodolistTitle: (newTodolistTitle: string, todolistId: string) => void;
  removeTodolist: (todolistId: string) => void;
};

export const Todolist = React.memo(
  ({ addTask, changeTodolistTitle, id, ...restProps }: TodolistPropsType) => {

    // debugger;
    console.log("Todolist");

    const addTaskForTodolist = useCallback(
      (title: string) => {
        return addTask(title, id);
      },
      [addTask, id]
    );

    const removeTodolist = () => {
      restProps.removeTodolist(id);
    };

    const changeTitleForTodolist = useCallback(
      (newTodolistTitle: string) => {
        changeTodolistTitle(newTodolistTitle, id);
      },
      [changeTodolistTitle, id]
    );

    let tasksForTodolist = restProps.tasks;
    if (restProps.filter === "Completed") {
      tasksForTodolist = restProps.tasks.filter((t) => t.isDone);
    }
    if (restProps.filter === "Active") {
      tasksForTodolist = restProps.tasks.filter((t) => !t.isDone);
    }
    return (
      <div>
        <h3>
          <EditableSpan
            title={restProps.title}
            onChange={changeTitleForTodolist}
          />
          <Button onClick={removeTodolist} startIcon={<Delete />}></Button>
        </h3>
        <AddItemForm addItem={addTaskForTodolist} />
        <div>
          {tasksForTodolist.map((t) => {
            return (
              <Task
                key={t.id}
                todolistId={id}
                removeTask={restProps.removeTask}
                task={t}
                changeTaskStatus={restProps.changeTaskStatus}
                changeTaskTitle={restProps.changeTaskTitle}
              />
            );
          })}
        </div>
        <div>
          {restProps.arrTitleFilter.map((t) => {
            return (
              <MyButton
                key={t}
                title={t}
                id={id}
                changeFilter={restProps.changeFilter}
                filter={restProps.filter}
              />
            );
          })}
        </div>
      </div>
    );
  }
);

