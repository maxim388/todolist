import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { ChangeEvent, KeyboardEvent, memo, useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";

export type AddItemFormPropsType = {
  addItem: (title: string) => void;
};

export const AddItemForm = memo((props: AddItemFormPropsType) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.currentTarget.value);
  };
  const onKeyUpHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null);
    }
    if (e.code === "Enter") {
      props.addItem(newTaskTitle);
      setNewTaskTitle("");
    }
  };
  const addTaskHandler = () => {
    if (newTaskTitle.trim() !== "") {
      props.addItem(newTaskTitle.trim());
      setNewTaskTitle("");
    } else {
      setError("Title is required");
    }
  };

  return (
    <div>
      <TextField
        size="small"
        value={newTaskTitle}
        onChange={onNewTitleChangeHandler}
        onKeyUp={onKeyUpHandler}
        variant={"outlined"}
        label={"Type value"}
        error={!!error}
        helperText={error}
      />
      <IconButton onClick={addTaskHandler}>
        <AddBoxIcon color="primary" fontSize="medium" />
      </IconButton>
    </div>
  );
});
