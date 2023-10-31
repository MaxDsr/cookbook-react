import {Controller} from "react-hook-form";
import TextField from "@mui/material/TextField";
import closeIcon from "../../assets/close-x.svg";
import {INGREDIENT_NAME, INGREDIENTS, INPUT_VALIDATION_RULES} from "../consts";

function IngredientFields({fields, control, errors, remove}) {
  return (
    <>
      {fields?.map((field, index) => {
        return (
          <Controller
            key={field.id}
            control={control}
            name={`${INGREDIENTS}.${index}.${INGREDIENT_NAME}`}
            rules={INPUT_VALIDATION_RULES}
            render={({ field }) => {
              return (
                <div className="input-wrap">
                  <TextField
                    label="Recipe name"
                    variant="outlined"
                    size="small"
                    {...field}
                    error={Boolean(errors[INGREDIENTS]?.[index]?.[INGREDIENT_NAME])}
                    helperText={errors[INGREDIENTS]?.[index]?.[INGREDIENT_NAME]?.message}/>
                  <img src={closeIcon} alt="remove" onClick={() => remove(index)}/>
                </div>
              )
            }}/>
        )
      })}
    </>
  )
}

export default IngredientFields;
