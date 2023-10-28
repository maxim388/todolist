import { useCallback, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { addTodolistTC } from "../features/TodolistsList/todolists-reducer";
import { Box, CircularProgress, LinearProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./hooks";
import { ErrorSnackbar } from "../components/ErrorSnackbar/ErrorSnackbar";
import { TodolistsList } from "../features/TodolistsList/TodolistsList";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "../features/Auth/Login";
import { initializeAppTC } from "./app-reducer";
import { logoutTC } from "../features/Auth/auth-reducer";
import { AppRootStateType } from "./store";

const selectStatus = (state: AppRootStateType) => state.app.status;
const selectIsInitialized = (state: AppRootStateType) => state.app.isInitialized;
const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;

export function App({ demo = true }) {
  const dispatch = useAppDispatch();
  const appStatus = useAppSelector(selectStatus);
  const appIsInitialized = useAppSelector(selectIsInitialized);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  useEffect(() => {
    dispatch(initializeAppTC());
  }, [dispatch]);

  const addTodoList = useCallback(
    (title: string) => {
      dispatch(addTodolistTC({ todolistTitle: title }));
    },
    [dispatch]
  );
  const logoutHandler = useCallback(() => {
    dispatch(logoutTC());
  }, [dispatch]);

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
