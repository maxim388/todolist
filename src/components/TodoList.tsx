import React, { useCallback } from "react";
import { FilterValuesType, TaskType, TodolistType } from "../AppWithRedux";
import { MyButton } from "./MyButton";
import { AddItemForm } from "./AddItemForm";
import { EditableSpan } from "./EditableSpan";
import Button from "@mui/material/Button";
import { Delete } from "@mui/icons-material";
import { Task } from "./Task";
import { useSelector } from "react-redux";
import { AppRootStateType } from "../store/store";
import { useDispatch } from "react-redux";
import {
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  removeTodolistAC,
} from "../reducers/todolists-reducer";
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
} from "../reducers/tasks-reducer";

export type TodolistPropsType = {
  todolist: TodolistType;
  // id: string;
  // title: string;
  // tasks: Array<TaskType>;
  // filter: FilterValuesType;

  arrTitleFilter: Array<FilterValuesType>;
  // removeTask: (taskId: string, todolistId: string) => void;
  // changeFilter: (value: FilterValuesType, todolistId: string) => void;
  // addTask: (title: string, todolistId: string) => void;
  // changeTaskStatus: (task: string, isBone: boolean, todolistId: string) => void;
  // changeTaskTitle: (task: string, newTitle: string, todolistId: string) => void;
  // changeTodolistTitle: (newTodolistTitle: string, todolistId: string) => void;
  // removeTodolist: (todolistId: string) => void;
};

// export type TodolistPropsType = {
//   id: string;
//   title: string;
//   tasks: Array<TaskType>;
//   arrTitleFilter: Array<FilterValuesType>;
//   filter: FilterValuesType;
//   removeTask: (taskId: string, todolistId: string) => void;
//   changeFilter: (value: FilterValuesType, todolistId: string) => void;
//   addTask: (title: string, todolistId: string) => void;
//   changeTaskStatus: (task: string, isBone: boolean, todolistId: string) => void;
//   changeTaskTitle: (task: string, newTitle: string, todolistId: string) => void;
//   changeTodolistTitle: (newTodolistTitle: string, todolistId: string) => void;
//   removeTodolist: (todolistId: string) => void;
// };

// export const Todolist = React.memo(
//   ({ addTask, changeTodolistTitle, id, ...restProps }: TodolistPropsType) => {

//     const addTaskForTodolist = useCallback(
//       (title: string) => {
//         return addTask(title, id);
//       },
//       [addTask, id]
//     );

//     const removeTodolist = () => {
//       restProps.removeTodolist(id);
//     };

//     const changeTitleForTodolist = useCallback(
//       (newTodolistTitle: string) => {
//         changeTodolistTitle(newTodolistTitle, id);
//       },
//       [changeTodolistTitle, id]
//     );

//     let tasksForTodolist = restProps.tasks;
//     if (restProps.filter === "Completed") {
//       tasksForTodolist = restProps.tasks.filter((t) => t.isDone);
//     }
//     if (restProps.filter === "Active") {
//       tasksForTodolist = restProps.tasks.filter((t) => !t.isDone);
//     }
//     return (
//       <div>
//         <h3>
//           <EditableSpan
//             title={restProps.title}
//             onChange={changeTitleForTodolist}
//           />
//           <Button onClick={removeTodolist} startIcon={<Delete />}></Button>
//         </h3>
//         <AddItemForm addItem={addTaskForTodolist} />
//         <div>
//           {tasksForTodolist.map((t) => {
//             return (
//               <Task
//                 key={t.id}
//                 todolistId={id}
//                 removeTask={restProps.removeTask}
//                 task={t}
//                 changeTaskStatus={restProps.changeTaskStatus}
//                 changeTaskTitle={restProps.changeTaskTitle}
//               />
//             );
//           })}
//         </div>
//         <div>
//           {restProps.arrTitleFilter.map((t) => {
//             return (
//               <MyButton
//                 key={t}
//                 title={t}
//                 id={id}
//                 changeFilter={restProps.changeFilter}
//                 filter={restProps.filter}
//               />
//             );
//           })}
//         </div>
//       </div>
//     );
//   }
// );

export const Todolist = () => {
  return <></>;
};
export const TodolistWithRedux = React.memo(
  ({ todolist, arrTitleFilter }: TodolistPropsType) => {
    const dispatch = useDispatch();
    const tasks = useSelector<AppRootStateType, TaskType[]>(
      (state) => state.tasks[todolist.id]
    );
    //  const addTask = useCallback(
    //    (title: string, todolistId: string) => {
    //      dispatch(addTaskAC(title, todolistId));
    //    },
    //    [dispatch]
    //  );

    // const changeTitleForTodolist = useCallback(
    //   (newTodolistTitle: string) => {
    //     changeTodolistTitle(newTodolistTitle, todolist.id);
    //   },
    //   [changeTodolistTitle, todolist.id]
    // );

    // const removeTodolist = () => {
    //   restProps.removeTodolist(todolist.id);
    // };

    const removeTodolist = useCallback(() => {
      dispatch(removeTodolistAC(todolist.id));
    }, [dispatch, todolist.id]);

    // const removeTodolist = useCallback(
    //   (todolistId: string) => {
    //     dispatch(removeTodolistAC(todolistId));
    //   },
    //   [dispatch]
    // );

    const changeTodolistTitle = useCallback(
      (newTodolistTitle: string) => {
        dispatch(changeTodolistTitleAC(newTodolistTitle, todolist.id));
      },
      [dispatch, todolist.id]
    );

    const addTask = useCallback(() => {
      dispatch(addTaskAC(todolist.title, todolist.id));
    }, [dispatch, todolist.title, todolist.id]);

    const removeTask = useCallback(
      (taskId: string, todolistId: string) => {
        dispatch(removeTaskAC(taskId, todolistId));
      },
      [dispatch]
    );

    const changeTaskStatus = useCallback(
      (taskId: string, isDone: boolean, todolistId: string) => {
        dispatch(changeTaskStatusAC(taskId, isDone, todolistId));
      },
      [dispatch]
    );

    const changeFilter = useCallback(
      (filter: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilterAC(filter, todolistId));
      },
      [dispatch]
    );

    const changeTaskTitle = useCallback(
      (taskId: string, newTitle: string, todolistId: string) => {
        dispatch(changeTaskTitleAC(taskId, newTitle, todolistId));
      },
      [dispatch]
    );

    let tasksForTodolist = tasks;
    if (todolist.filter === "Completed") {
      tasksForTodolist = tasks.filter((t) => t.isDone);
    }
    if (todolist.filter === "Active") {
      tasksForTodolist = tasks.filter((t) => !t.isDone);
    }
    return (
      <div>
        <h3>
          <EditableSpan title={todolist.title} onChange={changeTodolistTitle} />
          <Button onClick={removeTodolist} startIcon={<Delete />}></Button>
        </h3>
        <AddItemForm addItem={addTask} />
        <div>
          {tasksForTodolist.map((t) => {
            return (
              <Task
                key={t.id}
                todolistId={todolist.id}
                removeTask={removeTask}
                task={t}
                changeTaskStatus={changeTaskStatus}
                changeTaskTitle={changeTaskTitle}
              />
            );
          })}
        </div>
        <div>
          {arrTitleFilter.map((t) => {
            return (
              <MyButton
                key={t}
                title={t}
                id={todolist.id}
                changeFilter={changeFilter}
                filter={todolist.filter}
              />
            );
          })}
        </div>
      </div>
    );
  }
);
