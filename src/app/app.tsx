import { useCallback, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, CircularProgress, LinearProgress } from "@mui/material";
import { useActions, useAppDispatch, useAppSelector } from "./hooks";
import { ErrorSnackbar } from "../components/ErrorSnackbar/ErrorSnackbar";
import { TodolistsList } from "../features/TodolistsList";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login, authActions } from "../features/Auth";
import { initializeApp } from "./app-reducer";
import { selectIsInitialized, selectStatus } from "./selectors";
import { authSelectors } from "../features/Auth";
import { addTodolist } from "../features/TodolistsList/todolists-reducer";

export function App({ demo = true }) {
  const dispatch = useAppDispatch();
  const { logout } = useActions(authActions);
  const appStatus = useAppSelector(selectStatus);
  const appIsInitialized = useAppSelector(selectIsInitialized);
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);

  useEffect(() => {
    dispatch(initializeApp());
  }, [dispatch]);

  const addTodoList = useCallback(
    async (title: string) => {
      dispatch(addTodolist({ todolistTitle: title }));
    },
    [dispatch]
  );
  const logoutHandler = useCallback(() => {
    logout();
  }, [logout]);

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
            element={<TodolistsList addTodoList={addTodoList} />}
          />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/404"} element={<h1>404: PAGE NOT FOUND</h1>} />
          <Route path={"*"} element={<Navigate to="/404" />} />
        </Routes>
      </Container>
    </Box>
  );
}