import React, { useReducer, useState } from "react";
import "./App.css";
import { Todolist } from "./components/TodoList";
import { v1 } from "uuid";
import { AddItemForm } from "./components/AddItemForm";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import {
  addTodolistAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  removeTodolistAC,
  todolistsReducer,
} from "./reducers/todolists-reducer";
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  tasksReducer,
} from "./reducers/tasks-reducer";

export type FilterValuesType = "All" | "Active" | "Completed";
export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
};
export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};
export type TodolistOfTasksType = {
  [key: string]: Array<TaskType>;
};

export function AppWithReducers() {
  let todolistId1 = v1();
  let todolistId2 = v1();
  let arrTitleFilter: Array<FilterValuesType> = ["All", "Active", "Completed"];

  let [todolists, dispatchToTodolistsReducer] = useReducer(todolistsReducer, [
    {
      id: todolistId1,
      title: "What to learn",
      filter: "All",
    },
    {
      id: todolistId2,
      title: "What to buy",
      filter: "All",
    },
  ]);

  let [tasksObj, dispatchToTasksReducer] = useReducer(tasksReducer, {
    [todolistId1]: [
      { id: v1(), title: "HTML&CSS", isDone: true },
      { id: v1(), title: "JS/TS", isDone: true },
      { id: v1(), title: "ReactJS", isDone: false },
      { id: v1(), title: "Redux", isDone: false },
      { id: v1(), title: "REST API", isDone: false },
    ],
    [todolistId2]: [
      { id: v1(), title: "book", isDone: false },
      { id: v1(), title: "milk", isDone: true },
    ],
  });

  function addTodoList(title: string) {
    const action = addTodolistAC(title);
    dispatchToTasksReducer(action);
    dispatchToTodolistsReducer(action);
  }

  function removeTodolist(todolistId: string) {
    const action = removeTodolistAC(todolistId);
    dispatchToTasksReducer(action);
    dispatchToTodolistsReducer(action);
  }

  function changeTodolistTitle(newTodolistTitle: string, todolistId: string) {
    dispatchToTodolistsReducer(
      changeTodolistTitleAC(newTodolistTitle, todolistId)
    );
  }

  function removeTask(taskId: string, todolistId: string) {
    dispatchToTasksReducer(removeTaskAC(taskId, todolistId));
  }

  function addTask(title: string, todolistId: string) {
    dispatchToTasksReducer(addTaskAC(title, todolistId));
  }

  function changeTaskStatus(
    taskId: string,
    isDone: boolean,
    todolistId: string
  ) {
    dispatchToTasksReducer(changeTaskStatusAC(taskId, isDone, todolistId));
  }

  function changeFilter(filter: FilterValuesType, todolistId: string) {
    dispatchToTodolistsReducer(changeTodolistFilterAC(filter, todolistId));
  }

  function changeTaskTitle(
    taskId: string,
    newTitle: string,
    todolistId: string
  ) {
    dispatchToTasksReducer(changeTaskTitleAC(taskId, newTitle, todolistId));
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <Container fixed>
        <Grid container style={{ padding: "20px" }}>
          <AddItemForm addItem={addTodoList} />
        </Grid>
        <Grid container spacing={3}>
          {todolists.map((tl) => {
            let tasksForTodolist = tasksObj[tl.id];
            if (tl.filter === "Completed") {
              tasksForTodolist = tasksForTodolist.filter((t) => t.isDone);
            }
            if (tl.filter === "Active") {
              tasksForTodolist = tasksForTodolist.filter((t) => !t.isDone);
            }
            return (
              <Grid item>
                <Paper style={{ padding: "10px" }}>
                  <Todolist
                    key={tl.id}
                    id={tl.id}
                    title={tl.title}
                    tasks={tasksForTodolist}
                    arrTitleFilter={arrTitleFilter}
                    filter={tl.filter}
                    removeTask={removeTask}
                    addTask={addTask}
                    changeFilter={changeFilter}
                    changeTaskStatus={changeTaskStatus}
                    changeTaskTitle={changeTaskTitle}
                    removeTodolist={removeTodolist}
                    changeTodolistTitle={changeTodolistTitle}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}
