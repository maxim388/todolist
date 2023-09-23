import axios, { AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  headers: {
    "API-KEY": "41b0e7ee-a396-4123-8fc6-d9277f02bce7",
  },
  withCredentials: true,
});

export type TodolistTypeAPI = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

type DataType = {
  item: TodolistTypeAPI;
};

type ResponceType<D = {}> = {
  data: D;
  messages: string[];
  fieldsErrors: string[];
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

export type TaskTypeAPI = {
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

type GetTaskResponceType = {
  items: TaskTypeAPI[];
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

type TodolistsAPIType = {
  getTodolists: () => Promise<AxiosResponse<any, any>>;
  createTodolist: (title: string) => Promise<AxiosResponse<any, any>>;
  deleteTodolist: (id: string) => Promise<AxiosResponse<any, any>>;
  updateTodolistTitle: (
    id: string,
    title: string
  ) => Promise<AxiosResponse<any, any>>;
  getTasks: (todolistId: string) => Promise<AxiosResponse<any, any>>; //fix
  createTask: (
    todolistId: string,
    taskTitle: string
  ) => Promise<AxiosResponse<any, any>>;
  deleteTask: (
    todolistId: string,
    taskId: string
  ) => Promise<AxiosResponse<any, any>>;
  updateTask: (
    todolistId: string,
    taskId: string,
    model: UpdateTaskModelType
  ) => Promise<AxiosResponse<any, any>>;
};

export const todolistsAPI: TodolistsAPIType = {
  getTodolists() {
    return instance.get<TodolistTypeAPI[]>(`todo-lists`);
  },
  createTodolist(title: string) {
    return instance.post<ResponceType<DataType>>(`todo-lists`, {
      title: title,
    });
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponceType>(`todo-lists/${id}`);
  },
  updateTodolistTitle(id: string, title: string) {
    return instance.put<ResponceType>(`todo-lists/${id}`, {
      title: title,
    });
  },
  getTasks(todolistId: string) {
    return instance.get<GetTaskResponceType>(`todo-lists/${todolistId}/tasks`);
  },
  createTask(todolistId: string, taskTitle: string) {
    return instance.post<ResponceType>(`todo-lists/${todolistId}/tasks/`, { 
      title: taskTitle,
    });
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponceType>(
      `todo-lists/${todolistId}/tasks/${taskId}`
    );
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<ResponceType>(
      `todo-lists/${todolistId}/tasks/${taskId}`,
      model
    );
  },
};
