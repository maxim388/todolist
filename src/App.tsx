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

export function App() {
  let todolistId1 = v1();
  let todolistId2 = v1();
  let arrTitleFilter: Array<FilterValuesType> = ["All", "Active", "Completed"];

  let [todolists, setTodolists] = useState<TodolistType[]>([
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

  let [tasksObj, setTasks] = useState<TodolistOfTasksType>({
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

  function removeTodolist(todolistId: string) {
    let filteredTodolist = todolists.filter((tl) => tl.id !== todolistId);
    setTodolists(filteredTodolist);
    delete tasksObj[todolistId];
    setTasks({ ...tasksObj });
  }

  //done
  function removeTask(taskId: string, todolistId: string) {
    let tasks = tasksObj[todolistId];
    let newFiltedTasks = tasks.filter((t) => t.id !== taskId);
    tasksObj[todolistId] = newFiltedTasks;
    setTasks({ ...tasksObj });
  }
  //done
  function addTask(title: string, todolistId: string) {
    let tasks = tasksObj[todolistId];
    let newTask = { id: v1(), title: title, isDone: false };
    let newTasks = [newTask, ...tasks];
    tasksObj[todolistId] = newTasks;
    setTasks({ ...tasksObj });
  }

  function changeTaskStatus(
    taskId: string,
    isDone: boolean,
    todolistId: string
  ) {
    let tasks = tasksObj[todolistId];
    let task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.isDone = isDone;
      setTasks({ ...tasksObj });
    }
  }

  function changeFilter(value: FilterValuesType, todolistId: string) {
    let todolist = todolists.find((tl) => tl.id === todolistId);
    if (todolist) {
      todolist.filter = value;
      setTodolists([...todolists]);
    }
  }

  function addTodoList(title: string) {
    let todolist: TodolistType = {
      id: v1(),
      title: title,
      filter: "All",
    };
    setTodolists([todolist, ...todolists]);
    setTasks({
      ...tasksObj,
      [todolist.id]: [],
    });
  }

  function changeTaskTitle(
    taskId: string,
    newTitle: string,
    todolistId: string
  ) {
    let tasks = tasksObj[todolistId];
    let task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.title = newTitle;
      setTasks({ ...tasksObj });
    }
  }
  function changeTodolistTitle(newTodolistTitle: string, todolistId: string) {
    const todolist = todolists.find((tl) => tl.id === todolistId);
    if (todolist) {
      todolist.title = newTodolistTitle;
      setTodolists([...todolists]);
    }
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
