import { RequestStatusType } from "./app-reducer";
import {
  FilterValuesType,
  TodolistDomainType,
  addTodolistAC,
  addTodolistTC,
  changeTodolistEntityStatusAC,
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
      entityStatus: "idle",
    },
    {
      id: todolistId2,
      title: "What to buy",
      addedDate: String(new Date()),
      order: 0,
      filter: "All",
      entityStatus: "idle",
    },
  ];
});

test("correct todolist should be removed", () => {
  const endState = todolistsReducer(startState, removeTodolistAC(todolistId1));

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
  const todoloist = {
    id: "string",
    title: "new todolist",
    addedDate: "string",
    order: 0,
  };
  const endState = todolistsReducer(startState, addTodolistAC(todoloist));

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(todoloist.title);
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

test("correct entity status of todolist should be changed", () => {
  let newStatus: RequestStatusType = "loading";

  const endState = todolistsReducer(
    startState,
    changeTodolistEntityStatusAC(todolistId2, newStatus)
  );

  expect(endState[0].entityStatus).toBe("idle");
  expect(endState[1].entityStatus).toBe(newStatus);
});

test("todolists schould be set to the state", () => {
  const action = setTodolistsAC(startState);

  const endState = todolistsReducer(startState, action);

  expect(endState.length).toBe(2);
});
