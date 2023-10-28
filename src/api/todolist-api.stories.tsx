import React, { useEffect, useState } from "react";
import { TodolistTypeAPI, todolistsAPI } from "./todolists-api";

export default {
  title: "API",
};

export const GetTodolists = () => {
  const [state, setState] = useState<TodolistTypeAPI[] | null>(null);
  useEffect(() => {
    todolistsAPI.getTodolists().then((res) => {
      setState(res.data);
    });
  }, []);
  return <div>{JSON.stringify(state)}</div>;
};
export const CreateTodolist = () => {
  const [state, setState] = useState<TodolistTypeAPI[] | null>(null);
  useEffect(() => {
    const title = "MAXIM TODOLIST"; //hard code
    todolistsAPI.createTodolist(title).then((res) => {
      setState(res.data);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};
export const DeleteTodolist = () => {
  const [state, setState] = useState<TodolistTypeAPI[] | null>(null);
  useEffect(() => {
    const todolistId = "c470ccfb-405d-42ec-8981-b1d3a5be4c76"; //hard code
    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      setState(res.data);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};
export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<TodolistTypeAPI[] | null>(null);
  useEffect(() => {
    const todolistId = "c470ccfb-405d-42ec-8981-b1d3a5be4c76"; //hard code
    const title = "Maxim todolist111"; //hard code
    todolistsAPI.updateTodolistTitle(todolistId, title).then((res) => {
      setState(res.data);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const GetTasks = () => {
  const [state, setState] = useState<any | null>(null);
  const [todolistId, setTodolistId] = useState<string>("");

  const getTasks = () => {
    todolistsAPI.getTasks(todolistId).then((res) => {
      setState(res.data);
    });
  };
  return (
    <div>
      {JSON.stringify(state)}

      <input
        type="text"
        placeholder={"todolistId"}
        value={todolistId}
        onChange={(e) => setTodolistId(e.currentTarget.value)}
      />
      <button onClick={getTasks}>getTasks </button>
    </div>
  );
};
export const CreateTask = () => {
  const [state, setState] = useState<any | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [todolistId, setTodolistId] = useState<string>("");

  const createTask = () => {
    todolistsAPI.createTask(todolistId, taskTitle).then((res) => {
      setState(res.data);
    });
  };
  return (
    <div>
      {JSON.stringify(state)}
      <input
        type="text"
        placeholder={"todolistId"}
        value={todolistId}
        onChange={(e) => setTodolistId(e.currentTarget.value)}
      />
      <input
        type="text"
        placeholder={"taskTitle"}
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.currentTarget.value)}
      />
      <button onClick={createTask}>createTask </button>
    </div>
  );
};
export const DeleteTask = () => {
  const [state, setState] = useState<any | null>(null);
  const [taskId, setTaskId] = useState<string>("");
  const [todolistId, setTodolistId] = useState<string>("");
  const deleteTask = () => {
    todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
      setState(res.data);
    });
  };

  return (
    <div>
      {JSON.stringify(state)}
      <input
        type="text"
        placeholder={"todolistId"}
        value={todolistId}
        onChange={(e) => setTodolistId(e.currentTarget.value)}
      />
      <input
        type="text"
        placeholder={"taskId"}
        value={taskId}
        onChange={(e) => setTaskId(e.currentTarget.value)}
      />
      <button onClick={deleteTask}>deleteTask </button>
    </div>
  );
};

export const UpdateTask = () => {
  const [state, setState] = useState<any | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<number>(0);
  const [priority, setPriority] = useState<number>(0);
  const [startData, setStartData] = useState<string>("");
  const [taskId, setTaskId] = useState<string>("");
  const [todolistId, setTodolistId] = useState<string>("");

  const updateTask = () => {
    const model = {
      title: title,
      description: description,
      status: status,
      priority: priority,
      startDate: startData,
      deadline: "",
    };
    todolistsAPI.updateTask(todolistId,taskId, model).then((res) => {
      setState(res.data);
    });
  };
  return (
    <div>
      {JSON.stringify(state)}
      <input
        placeholder={"title"}
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
      />
      <input
        placeholder={"description"}
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
      />
      <input
        placeholder={"status"}
        value={status}
        onChange={(e) => setStatus(Number(e.currentTarget.value))}
      />
      <input
        placeholder={"priority"}
        value={priority}
        onChange={(e) => setPriority(Number(e.currentTarget.value))}
      />
      <input
        placeholder={"startData"}
        value={startData}
        onChange={(e) => setStartData(e.currentTarget.value)}
      />
      <input
        placeholder={"taskId"}
        value={taskId}
        onChange={(e) => setTaskId(e.currentTarget.value)}
      />
      <input
        placeholder={"todolistId"}
        value={todolistId}
        onChange={(e) => setTodolistId(e.currentTarget.value)}
      />

      <button onClick={updateTask}>updateTask </button>
    </div>
  );
};
