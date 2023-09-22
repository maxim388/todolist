import {
  TodolistDomainType,
  addTodolistTC,
  todolistsReducer,
} from "./todolists-reducer";
import { TodolistOfTasksType, tasksReducer } from "./tasks-reducer";

test("ids should be equals", () => {
  const startTasksState: TodolistOfTasksType = {};
  const startTodolistsState: TodolistDomainType[] = [];

  const action = addTodolistTC("new todolist");

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.todolistId);
  expect(idFromTodolists).toBe(action.todolistId);
});
