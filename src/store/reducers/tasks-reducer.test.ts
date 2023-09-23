import {
  addTodolistAC,
  removeTodolistAC,
  setTodolistsAC,
} from "./todolists-reducer";
import {
  TodolistOfTasksType,
  addTaskAC,
  removeTaskAC,
  setTasksAC,
  tasksReducer,
  updateTaskAC,
} from "./tasks-reducer";
import { TodoTaskPriority, TodoTaskStatus } from "../../api/todolists-api";

let startState: TodolistOfTasksType;

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        description: "",
        todoListId: "todolistId1",
        order: 0,
        status: TodoTaskStatus.New,
        priority: TodoTaskPriority.Later,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: "2",
        title: "JS",
        description: "",
        todoListId: "todolistId1",
        order: 0,
        status: TodoTaskStatus.Completed,
        priority: TodoTaskPriority.Later,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: "3",
        title: "React",
        description: "",
        todoListId: "todolistId1",
        order: 0,
        status: TodoTaskStatus.New,
        priority: TodoTaskPriority.Later,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        description: "",
        todoListId: "todolistId2",
        order: 0,
        status: TodoTaskStatus.New,
        priority: TodoTaskPriority.Later,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: "2",
        title: "milk",
        description: "",
        todoListId: "todolistId2",
        order: 0,
        status: TodoTaskStatus.Completed,
        priority: TodoTaskPriority.Later,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: "3",
        title: "tea",
        description: "",
        todoListId: "todolistId2",
        order: 0,
        status: TodoTaskStatus.New,
        priority: TodoTaskPriority.Later,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
    ],
  };
});

test("correct task should be deleted from correct array", () => {
  const action = removeTaskAC("todolistId2", "2");

  const endState = tasksReducer(startState, action);

  expect(endState).toEqual({
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        description: "",
        todoListId: "todolistId1",
        order: 0,
        status: TodoTaskStatus.New,
        priority: TodoTaskPriority.Later,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: "2",
        title: "JS",
        description: "",
        todoListId: "todolistId1",
        order: 0,
        status: TodoTaskStatus.Completed,
        priority: TodoTaskPriority.Later,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: "3",
        title: "React",
        description: "",
        todoListId: "todolistId1",
        order: 0,
        status: TodoTaskStatus.New,
        priority: TodoTaskPriority.Later,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        description: "",
        todoListId: "todolistId2",
        order: 0,
        status: TodoTaskStatus.New,
        priority: TodoTaskPriority.Later,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: "3",
        title: "tea",
        description: "",
        todoListId: "todolistId2",
        order: 0,
        status: TodoTaskStatus.New,
        priority: TodoTaskPriority.Later,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
    ],
  });
});

test("correct task should be added to correct array", () => {
  const action = addTaskAC({
    id: "1",
    title: "juce",
    description: "",
    todoListId: "todolistId2",
    order: 0,
    status: TodoTaskStatus.New,
    priority: TodoTaskPriority.Later,
    startDate: "",
    deadline: "",
    addedDate: "",
  });

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juce");
  expect(endState["todolistId2"][0].status).toBe(TodoTaskStatus.New);
});

test("status of specified task should be changed", () => {
const action = updateTaskAC("todolistId2", "2", {status: TodoTaskStatus.New});

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId2"][1].status).toBe(TodoTaskStatus.New);
  expect(endState["todolistId2"].length).toBe(3);
});

test("new array should be added when new todolist is added", () => {
  const todoloist = {
    id: "string",
    title: "new todolist",
    addedDate: "string",
    order: 0,
  };
  const action = addTodolistAC(todoloist);

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2");
  if (!newKey) {
    throw Error("new key should be added");
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test("property with todolistId should be deleted", () => {
  const action = removeTodolistAC("todolistId2");

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});

test("empty arrays should be added when we set todolists", () => {
  const action = setTodolistsAC([
    { id: "1", title: "title 1", order: 0, addedDate: "", filter: "All" },
    { id: "2", title: "title 2", order: 0, addedDate: "", filter: "All" },
  ]);

  const endState = tasksReducer({}, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(2);
  expect(endState["1"]).toBeDefined();
  expect(endState["2"]).toBeDefined();
});

test("tasks should be added for todolist", () => {
  const action = setTasksAC("todolistId1", startState["todolistId1"]);

  const endState = tasksReducer(
    {
      todolistId2: [],
      todolistId1: [],
    },
    action
  );

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(0);
});
