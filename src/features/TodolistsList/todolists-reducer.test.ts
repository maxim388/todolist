import { RequestStatusType } from "../../app/app-reducer";
import {
  FilterValuesType,
  TodolistDomainType,
  changeTodolistEntityStatus,
  todolistsReducer,
} from "./todolists-reducer";
import {
  addTodolist, changeTodolistFilter,
  changeTodolistTitle,
  // changeTodolistFilterAC,
  // changeTodolistTitleAC,
  fetchTodolists,
  removeTodolist
} from "./todolists-actions";
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
  const param = { todolistId: todolistId1 };
  const meta = param;
  const endState = todolistsReducer(
    startState,
    removeTodolist.fulfilled(param, "", meta)
  );

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
  const param = {
    todolist: {
      id: "string",
      title: "new todolist",
      addedDate: "string",
      order: 0,
    },
  };
  const meta = { todolistTitle: param.todolist.title };
  const endState = todolistsReducer(
    startState,
    addTodolist.fulfilled(param, "", meta)
  );

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(param.todolist.title);
});

test("correct todolist should change its name", () => {
  const param = { todolistId: todolistId2, title: "New Todolist" };
  const meta = param;
  const endState = todolistsReducer(
    startState,
    changeTodolistTitle.fulfilled(param, "", meta)
  );

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(param.title);
});

test("correct filter of todolist should be changed", () => {
  const param = {
    todolistId: todolistId2,
    filter: "Completed" as FilterValuesType,
  };
  const meta = param;
  const endState = todolistsReducer(
    startState,
    changeTodolistFilter.fulfilled(param, "", meta)
  );

  expect(endState[0].filter).toBe("All");
  expect(endState[1].filter).toBe("Completed");
});

test("correct entity status of todolist should be changed", () => {
  let newStatus: RequestStatusType = "loading";

  const endState = todolistsReducer(
    startState,
    changeTodolistEntityStatus({ todolistId: todolistId2, status: newStatus })
  );

  expect(endState[0].entityStatus).toBe("idle");
  expect(endState[1].entityStatus).toBe(newStatus);
});

test("todolists schould be set to the state", () => {
  const action = fetchTodolists.fulfilled({ todolists: startState }, "");

  const endState = todolistsReducer(startState, action);

  expect(endState.length).toBe(2);
});
