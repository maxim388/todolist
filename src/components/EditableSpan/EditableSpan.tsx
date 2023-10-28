import { TextField } from "@mui/material";
import { FC, ChangeEvent, memo, useState } from "react";

export type EditableSpanPropsType = {
  title: string;
  onChange: (newValue: string) => void;
};
export const EditableSpan: FC<EditableSpanPropsType> = memo((restProps) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const activeEditMode = () => {
    setEditMode(true);
    setTitle(restProps.title);
  };
  const activeViewMode = () => {
    restProps.onChange(title);
    setEditMode(false);
  };
  const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  return editMode ? (
    <TextField
      value={title}
      onBlur={activeViewMode}
      autoFocus
      onChange={onChangeTitleHandler}
    />
  ) : (
    <span onDoubleClick={activeEditMode}>{restProps.title}</span>
  );
});
