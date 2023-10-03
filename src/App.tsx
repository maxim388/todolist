import { useCallback, useEffect } from "react";
import { AddItemForm } from "./components/AddItemForm";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import {
  FilterValuesType,
  addTodolistTC,
  fetchTodolistsTC,
} from "./store/reducers/todolists-reducer";
import { Box, LinearProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import { ErrorSnackbar } from "./components/ErrorSnackbar";
import { TodolistsList } from "./components/TodolistsList";
import { Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";

export function App({ demo = true }) {
  const dispatch = useAppDispatch();
  const appStatus = useAppSelector((state) => state.app.status);

  // let arrTitleFilter: FilterValuesType[] = ["All", "Active", "Completed"];

  useEffect(() => {
    dispatch(fetchTodolistsTC());
  }, [dispatch]);

  const addTodoList = useCallback(
    (title: string) => {
      dispatch(addTodolistTC(title));
    },
    [dispatch]
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ErrorSnackbar />
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
        {appStatus === "loading" && <LinearProgress color="secondary" />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route
            path={"/"}
            element={<TodolistsList demo={demo} addTodoList={addTodoList} />}
          />
          <Route path={"/login"} element={<Login />} />
        </Routes>
      </Container>
    </Box>
  );
}
