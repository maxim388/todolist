import { AxiosResponse } from "axios";

export type TodolistAPIType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};
export type DataType = {
  item: TodolistAPIType;
};
export type FieldErrorType = { field: string; error: string };
export type ResponseType<D = {}> = {
  data: D;
  messages: string[];
  fieldsErrors: FieldErrorType[];
  resultCode: number;
};
export enum TodoTaskStatus {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}
export enum TodoTaskPriority {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}
export type TaskAPIType = {
  id: string;
  title: string;
  description: string;
  todoListId: string;
  order: number;
  status: TodoTaskStatus;
  priority: TodoTaskPriority;
  startDate: string;
  deadline: string;
  addedDate: string;
};
export type GetTaskResponceType = {
  items: TaskAPIType[];
  totalCount: number;
  error: string | null;
};
export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TodoTaskStatus;
  priority: TodoTaskPriority;
  startDate: string;
  deadline: string;
};
export type TodolistsAPIType = {
  getTodolists: () => Promise<AxiosResponse<any, any>>;
  createTodolist: (title: string) => Promise<AxiosResponse<any, any>>;
  deleteTodolist: (id: string) => Promise<AxiosResponse<any, any>>;
  updateTodolistTitle: (id: string, title: string) => Promise<AxiosResponse<any, any>>;
  getTasks: (todolistId: string) => Promise<AxiosResponse<any, any>>; //fix
  createTask: (todolistId: string, taskTitle: string) => Promise<AxiosResponse<any, any>>;
  deleteTask: (todolistId: string, taskId: string) => Promise<AxiosResponse<any, any>>;
  updateTask: (
    todolistId: string,
    taskId: string,
    model: UpdateTaskModelType
  ) => Promise<AxiosResponse<any, any>>;
};
export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};
export type AuthAPIType = {
  login: (data: LoginParamsType) => Promise<AxiosResponse<any, any>>;
  logout: () => Promise<AxiosResponse<any, any>>;
  me: () => Promise<AxiosResponse<any, any>>;
};
