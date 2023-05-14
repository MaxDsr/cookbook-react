import {INPUT_VALIDATION_RULES} from "../consts";
import TextField from "@mui/material/TextField";
import {Controller} from "react-hook-form";


function FormField({name, label, control, errors}) {
  return (
    <Controller name={name}
                control={control}
                rules={INPUT_VALIDATION_RULES}
                render={
                  ({ field }) =>
                    <TextField
                      label={label}
                      variant="standard"
                      {...field}
                      error={Boolean(errors[name])}
                      helperText={errors[name]?.message}/>
                }
    />
  )
}

export default FormField;
