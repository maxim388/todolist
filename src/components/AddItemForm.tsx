import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { ChangeEvent, FC, KeyboardEvent, memo, useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";

export type AddItemFormPropsType = {
  addItem: (title: string) => void;
};

export const AddItemForm: FC<AddItemFormPropsType> = memo(
  (props) => {
    const [taskTitle, setTaskTitle] = useState("");
    const [error, setError] = useState<string | null>(null);

    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setTaskTitle(e.currentTarget.value);
    };
    const onKeyUpHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (error !== null) {
        setError(null);
      }
      if (e.code === "Enter") {
        props.addItem(taskTitle);
        setTaskTitle("");
      }
    };
    const addTaskTitleHandler = () => {
      if (taskTitle.trim() !== "") {
        props.addItem(taskTitle.trim());
        setTaskTitle("");
      } else {
        setError("Title is required");
      }
    };

    return (
      <div>
        <TextField
          size="small"
          value={taskTitle}
          onChange={onNewTitleChangeHandler}
          onKeyUp={onKeyUpHandler}
          variant={"outlined"}
          label={"Type value"}
          error={!!error}
          helperText={error}
        />
        <IconButton onClick={addTaskTitleHandler}>
          <AddBoxIcon color="primary" fontSize="medium" />
        </IconButton>
      </div>
    );
  }
);
