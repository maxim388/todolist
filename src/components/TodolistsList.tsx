import { FC, memo, useCallback, useEffect } from "react";
import { FilterValuesType, fetchTodolistsTC } from "../store/reducers/todolists-reducer";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { Grid, Paper } from "@mui/material";
import { Todolist } from "./TodoList";
import { AddItemForm } from "./AddItemForm";
import { Navigate } from "react-router-dom";

let arrTitleFilter: FilterValuesType[] = ["All", "Active", "Completed"];
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
  }, []);

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
