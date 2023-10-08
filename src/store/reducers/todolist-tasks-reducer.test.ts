import {
  TodolistDomainType,
  addTodolistAC,
  addTodolistTC,
  todolistsReducer,
} from "./todolists-reducer";
import { TodolistOfTasksType, tasksReducer } from "./tasks-reducer";

test("ids should be equals", () => {
  const startTasksState: TodolistOfTasksType = {};
  const startTodolistsState: TodolistDomainType[] = [];
  const todolist = {
    id: "string",
    title: "new todolist",
    addedDate: "string",
    order: 0,
  };
  const action = addTodolistAC({todolist});

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
