import { FC, useEffect } from "react";
import { FilterValuesType } from "./todolists-reducer";
import { useActions, useAppSelector } from "../../utils/redux-utils";
import { Grid, Paper } from "@mui/material";
import { Todolist } from "./Todolist/Todolist";
import { AddItemForm } from "../../components/AddItemForm/AddItemForm";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "../Auth/selectors";
import { todolistsActions } from ".";

const arrTitleFilter: FilterValuesType[] = ["All", "Active", "Completed"];

type TodolistsListPropsType = {
  addTodolist: (title: string) => Promise<any>;
};

export const TodolistsList: FC<TodolistsListPropsType> = ({ addTodolist }) => {
  const todolists = useAppSelector((state) => state.todolists);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const { fetchTodolists } = useActions(todolistsActions);

  useEffect(() => {
    fetchTodolists();
  }, [fetchTodolists]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      {/* fixme: style={{flexWrap: "nowrap", overflowX: "scroll"}}  */}
      <Grid
        container
        spacing={3}
        // style={{ flexWrap: "nowrap", overflowX: "scroll" }}
      >
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px", width: "300px" }}>
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
    </>
  );
};
