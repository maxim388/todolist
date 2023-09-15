import {
  applyMiddleware,
  combineReducers,
  createStore,
  legacy_createStore,
} from "redux";
import { TasksActionsType, tasksReducer } from "../reducers/tasks-reducer";
import {
  TodolistsActionsType,
  todolistsReducer,
} from "../reducers/todolists-reducer";
import thunkMiddleware, { ThunkAction } from "redux-thunk";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
});
// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>;

//все типы actions для App
export type AppActionsType = TodolistsActionsType | TasksActionsType;

export type AppThunkType<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  AppActionsType
>;

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
