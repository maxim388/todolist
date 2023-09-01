import { TextField } from "@mui/material";
import React, { ChangeEvent, useState } from "react";

export type EditableSpanPropsType = {
  title: string;
  onChange: (newValue: string) => void;
};
export const EditableSpan = React.memo((props: EditableSpanPropsType) => {

  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const activeEditMode = () => {
    setEditMode(true);
    setTitle(props.title);
  };
  const activeViewMode = () => setEditMode(false);
  const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
    props.onChange(e.currentTarget.value);
  };

  return editMode ? (
    <TextField
      value={title}
      onBlur={activeViewMode}
      autoFocus
      onChange={onChangeTitleHandler}
    />
  ) : (
    <span onDoubleClick={activeEditMode}>{props.title}</span>
  );
});
