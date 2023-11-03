import axios from "axios";
import {
  DataType,
  GetTaskResponceType,
  LoginParamsType,
  ResponseType,
  TodolistAPIType,
  TodolistsAPIType,
  UpdateTaskModelType,
  AuthAPIType,
} from "./types";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  headers: {
    "API-KEY": "41b0e7ee-a396-4123-8fc6-d9277f02bce7",
  },
  withCredentials: true,
});

export const todolistsAPI: TodolistsAPIType = {
  getTodolists() {
    return instance.get<TodolistAPIType[]>(`todo-lists`);
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<DataType>>(`todo-lists`, {
      title: title,
    });
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`);
  },
  updateTodolistTitle(id: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${id}`, {
      title: title,
    });
  },
  getTasks(todolistId: string) {
    return instance.get<GetTaskResponceType>(`todo-lists/${todolistId}/tasks`);
  },
  createTask(todolistId: string, taskTitle: string) {
    return instance.post<ResponseType>(`todo-lists/${todolistId}/tasks/`, {
      title: taskTitle,
    });
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};

export const authAPI: AuthAPIType = {
  login(data: LoginParamsType) {
    return instance.post<ResponseType<{ userId?: number }>>(`auth/login`, data);
  },
  logout() {
    return instance.delete<ResponseType<{ userId?: number }>>(`auth/login`);
  },
  me() {
    return instance.get<ResponseType<{ id: number; email: string; login: string }>>(`auth/me`);
  },
};
