import React, { useReducer, useState } from "react";
import "./App.css";
import { 
  Todolist,
   TodolistWithRedux } from "./components/TodoList";
import { useCallback } from "react";
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
import { useDispatch } from "react-redux";
import { AppRootStateType } from "./store/store";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";

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

export function AppWithRedux() {
  console.log("AppWithRedux");

  const dispatch = useDispatch();
  const todolists = useSelector<AppRootStateType, TodolistType[]>(
    (state) => state.todolists
  );
  // const tasks = useSelector<AppRootStateType, TodolistOfTasksType>(
  //   (state) => state.tasks
  // );

  let arrTitleFilter: Array<FilterValuesType> = ["All", "Active", "Completed"];

  const addTodoList = useCallback(
    (title: string) => {
      dispatch(addTodolistAC(title));
    },
    [dispatch]
  );

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
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
              return (
                <Grid item>
                  <Paper style={{ padding: "10px" }}>
                    {/* <Todolist
                      key={tl.id}
                      id={tl.id}
                      title={tl.title}
                      tasks={tasks[tl.id]}
                      arrTitleFilter={arrTitleFilter}
                      filter={tl.filter}
                      removeTask={removeTask}
                      addTask={addTask}
                      changeFilter={changeFilter}
                      changeTaskStatus={changeTaskStatus}
                      changeTaskTitle={changeTaskTitle}
                      removeTodolist={removeTodolist}
                      changeTodolistTitle={changeTodolistTitle}
                    /> */}

                    <TodolistWithRedux
                      key={tl.id}
                      todolist={tl}
                      // id={tl.id}
                      // title={tl.title}
                      // tasks={tasks[tl.id]}
                      // filter={tl.filter}


                      arrTitleFilter={arrTitleFilter}
                      // removeTask={removeTask}
                      // addTask={addTask}
                      // changeFilter={changeFilter}
                      // changeTaskStatus={changeTaskStatus}
                      // changeTaskTitle={changeTaskTitle}
                      // removeTodolist={removeTodolist}
                      // changeTodolistTitle={changeTodolistTitle}
                    />
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    </div>
  );
}
