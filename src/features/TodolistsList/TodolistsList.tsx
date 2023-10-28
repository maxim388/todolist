import { FC, useEffect } from "react";
import { FilterValuesType, fetchTodolistsTC } from "./todolists-reducer";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Grid, Paper } from "@mui/material";
import { Todolist } from "./Todolist/TodoList";
import { AddItemForm } from "../../components/AddItemForm/AddItemForm";
import { Navigate } from "react-router-dom";

const arrTitleFilter: FilterValuesType[] = ["All", "Active", "Completed"];
type TodolistsListPropsType = {
  demo: boolean;
  addTodoList: (title: string) => void;
};

export const TodolistsList: FC<TodolistsListPropsType> = ({
  demo,
  addTodoList,
}) => {
  const dispatch = useAppDispatch();
  const todolists = useAppSelector((state) => state.todolists);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    dispatch(fetchTodolistsTC());
  }, [dispatch]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodoList} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  key={tl.id}
                  todolist={tl}
                  arrTitleFilter={arrTitleFilter}
                  demo={demo}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
