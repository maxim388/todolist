import { useCallback, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import {
  addTodolistTC,
  fetchTodolistsTC,
} from "./store/reducers/todolists-reducer";
import { Box, CircularProgress, LinearProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import { ErrorSnackbar } from "./components/ErrorSnackbar";
import { TodolistsList } from "./components/TodolistsList";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { initializeAppTC } from "./store/reducers/app-reducer";
import { logoutTC } from "./store/reducers/auth-reducer";

export function App({ demo = true }) {
  const dispatch = useAppDispatch();
  const appStatus = useAppSelector((state) => state.app.status);
  const appIsInitialized = useAppSelector((state) => state.app.isInitialized);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  // let arrTitleFilter: FilterValuesType[] = ["All", "Active", "Completed"];

  useEffect(() => {
    dispatch(initializeAppTC());
  }, []);

  const addTodoList = useCallback((title: string) => {
    dispatch(addTodolistTC({ todolistTitle: title }));
  }, []);
  const logoutHandler = useCallback(() => {
    dispatch(logoutTC());
  }, []);

  if (!appIsInitialized) {
    return (
      // fix style
      <div
        style={{
          position: "fixed",
          top: "30%",
          textAlign: "center",
          width: "100%",
        }}
      >
        <CircularProgress />
      </div>
    );
  }
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
          {isLoggedIn && (
            <Button color="inherit" onClick={logoutHandler}>
              Log out
            </Button>
          )}
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
          <Route path={"/404"} element={<h1>404: PAGE NOT FOUND</h1>} />
          <Route path={"*"} element={<Navigate to="/404" />} />
        </Routes>
      </Container>
    </Box>
  );
}
