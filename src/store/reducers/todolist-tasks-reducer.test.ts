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
  const todoloist = {
    id: "string",
    title: "new todolist",
    addedDate: "string",
    order: 0,
  };
  const action = addTodolistAC(todoloist);

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.todolist.id);
  expect(idFromTodolists).toBe(action.todolist.id);
});
