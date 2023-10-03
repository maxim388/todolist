import { FC, memo, useCallback, useEffect } from "react";
import { FilterValuesType } from "../store/reducers/todolists-reducer";
import { useAppSelector } from "../hooks/hooks";
import { Grid, Paper } from "@mui/material";
import { Todolist } from "./TodoList";
import { AddItemForm } from "./AddItemForm";

let arrTitleFilter: FilterValuesType[] = ["All", "Active", "Completed"];
type TodolistsListPropsType = {
  demo: boolean;
  addTodoList: (title: string) => void;
};

export const TodolistsList: FC<TodolistsListPropsType> = ({ demo, addTodoList }) => {
  const todolists = useAppSelector((state) => state.todolists);
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
