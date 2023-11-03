import { TextField } from "@mui/material";
import { FC, ChangeEvent, memo, useState } from "react";

export type EditableSpanPropsType = {
  title: string;
  onChange: (newValue: string) => void;
};
export const EditableSpan: FC<EditableSpanPropsType> = memo(({ title, onChange }) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [titleField, setTitleField] = useState<string>("");
  const activeEditMode = () => {
    setEditMode(true);
    setTitleField(title);
  };
  const activeViewMode = () => {
    onChange(titleField);
    setEditMode(false);
  };
  const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitleField(e.currentTarget.value);
  };

  return editMode ? (
    <TextField
      value={titleField}
      onBlur={activeViewMode}
      autoFocus
      onChange={onChangeTitleHandler}
    />
  ) : (
    <span onDoubleClick={activeEditMode}>{title}</span>
  );
});
