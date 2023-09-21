import "./App.css";
import { Todolist } from "./components/TodoList";
import { useCallback, useEffect } from "react";
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
  FilterValuesType,
  addTodolistTC,
  fetchTodolistsTC,
} from "./reducers/todolists-reducer";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./app/hooks";

export function App() {
  const dispatch = useAppDispatch();
  const todolists = useAppSelector((state) => state.todolists);

  let arrTitleFilter: FilterValuesType[] = ["All", "Active", "Completed"];

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
                    <Todolist
                      key={tl.id}
                      todolist={tl}
                      arrTitleFilter={arrTitleFilter}
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
