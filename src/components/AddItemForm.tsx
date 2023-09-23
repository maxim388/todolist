import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { ChangeEvent, FC, KeyboardEvent, memo, useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Button } from "@mui/material";

export type AddItemFormPropsType = {
  addItem: (title: string) => void;
  disabled?: boolean;
};

export const AddItemForm: FC<AddItemFormPropsType> = memo(
  ({ addItem, disabled }) => {
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
        addItem(taskTitle);
        setTaskTitle("");
      }
    };
    const addTaskTitleHandler = () => {
      if (taskTitle.trim() !== "") {
        addItem(taskTitle.trim());
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
          disabled={disabled}
          onChange={onNewTitleChangeHandler}
          onKeyUp={onKeyUpHandler}
          variant={"outlined"}
          label={"Type value"}
          error={!!error}
          helperText={error}
        />
        <Button
          onClick={addTaskTitleHandler}
          disabled={disabled}
          startIcon={<AddBoxIcon />}
        ></Button>
      </div>
    );
  }
);
