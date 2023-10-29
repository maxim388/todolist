import TextField from "@mui/material/TextField";
import { ChangeEvent, FC, KeyboardEvent, memo, useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Button } from "@mui/material";

export type AddItemFormPropsType = {
  addItem: (title: string) => Promise<any>;
  disabled?: boolean;
};

export const AddItemForm: FC<AddItemFormPropsType> = memo(({ addItem, disabled }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };
  const onKeyUpHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) setError(null);
    if (e.code === "Enter") {
      addItem(title);
      setTitle("");
    }
  };
  const addTitleHandler = async () => {
    if (title.trim() !== "") {
      try {
        await addItem(title.trim());
        setTitle("");
      } catch (err: any) {
        setError(err.message);
      }
    } else {
      setError("Title is required");
    }
  };

  return (
    <div>
      <TextField
        size="small"
        value={title}
        disabled={disabled}
        onChange={onNewTitleChangeHandler}
        onKeyUp={onKeyUpHandler}
        variant={"outlined"}
        label={"Type value"}
        error={!!error}
        helperText={error}
      />
      <Button
        onClick={addTitleHandler}
        disabled={disabled}
        startIcon={<AddBoxIcon />}
      ></Button>
    </div>
  );
});
