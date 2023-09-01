import { v1 } from "uuid";
import { FilterValuesType, TodolistType } from "../AppWithRedux";

export const REMOVE_TODOLIST = "REMOVE-TODOLIST";
export const ADD_TODOLIST = "ADD-TODOLIST";
const CHANGE_TODOLIST_TITLE = "CHANGE-TODOLIST-TITLE";
const CHANGE_TODOLIST_FILTER = "CHANGE-TODOLIST-FILTER";

export let todolistId1 = v1();
export let todolistId2 = v1();

const initialState: TodolistType[] = [
  {
    id: todolistId1,
    title: "What to learn",
    filter: "All",
  },
  {
    id: todolistId2,
    title: "What to buy",
    filter: "All",
  },
];

type ActionsType =
  | RemoveTodolistACType
  | AddTodolistACType
  | ChangeTodolistTitleACType
  | ChangeTodolistFilterACType;

export const todolistsReducer = (
  state: TodolistType[] = initialState,
  action: ActionsType
): TodolistType[] => {
  // debugger;
  switch (action.type) {
    case REMOVE_TODOLIST:
      return state.filter((t) => t.id !== action.todolistId);
    case ADD_TODOLIST:
      return [
        {
          id: action.todolistId,
          title: action.title,
          filter: "All",
        },
        ...state,
      ];
    case CHANGE_TODOLIST_TITLE:
      return state.map((t) =>
        t.id === action.todolistId ? { ...t, title: action.title } : t
      );
    case CHANGE_TODOLIST_FILTER:
      return state.map((t) =>
        t.id === action.todolistId ? { ...t, filter: action.filter } : t
      );
    default:
      return state;
  }
};

export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>;
export type AddTodolistACType = ReturnType<typeof addTodolistAC>;
export type ChangeTodolistTitleACType = ReturnType<
  typeof changeTodolistTitleAC
>;
export type ChangeTodolistFilterACType = ReturnType<
  typeof changeTodolistFilterAC
>;

export const removeTodolistAC = (todolistId: string) => {
  return { type: REMOVE_TODOLIST, todolistId } as const;
};

export const addTodolistAC = (title: string) => {
  return {
    type: ADD_TODOLIST,
    title,
    todolistId: v1(),
  } as const;
};

export const changeTodolistTitleAC = (title: string, todolistId: string) => {
  return {
    type: CHANGE_TODOLIST_TITLE,
    todolistId,
    title,
  } as const;
};

export const changeTodolistFilterAC = (
  filter: FilterValuesType,
  todolistId: string
) => {
  return {
    type: CHANGE_TODOLIST_FILTER,
    filter,
    todolistId,
  } as const;
};
