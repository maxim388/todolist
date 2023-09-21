import {
  FilterValuesType,
  TodolistDomainType,
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  removeTodolistAC,
  setTodolistsAC,
  todolistsReducer,
} from "./todolists-reducer";
import { v1 } from "uuid";

let todolistId1: string;
let todolistId2: string;
let startState: TodolistDomainType[];

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();
  startState = [
    {
      id: todolistId1,
      title: "What to learn",
      addedDate: String(new Date()),
      order: 0,
      filter: "All",
    },
    {
      id: todolistId2,
      title: "What to buy",
      addedDate: String(new Date()),
      order: 0,
      filter: "All",
    },
  ];
});

test("correct todolist should be removed", () => {
  const endState = todolistsReducer(startState, removeTodolistAC(todolistId1));

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
  let newTodolistTitle = "New Todolist";

  const endState = todolistsReducer(
    startState,
    addTodolistAC(newTodolistTitle)
  );

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodolistTitle);
});

test("correct todolist should change its name", () => {
  let newTodolistTitle = "New Todolist";

  const endState = todolistsReducer(
    startState,
    changeTodolistTitleAC(todolistId2, newTodolistTitle)
  );

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct filter of todolist should be changed", () => {
  let newFilter: FilterValuesType = "Completed";

  const endState = todolistsReducer(
    startState,
    changeTodolistFilterAC(todolistId2, newFilter)
  );

  expect(endState[0].filter).toBe("All");
  expect(endState[1].filter).toBe(newFilter);
});

test("todolists schould be set to the state", () => {
  const action = setTodolistsAC(startState);

  const endState = todolistsReducer(startState, action);

  expect(endState.length).toBe(2);
});
