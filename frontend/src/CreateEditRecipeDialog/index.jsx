import { useCallback, useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CircularProgress from "@mui/material/CircularProgress";
import { createRecipe, editRecipe } from "../services/store/RecipesSlice";
import { useDispatch } from "react-redux";
import { useForm, Controller, useFormState, useFieldArray } from "react-hook-form";
import AddImage from "../add-file/AddImage";
import {DEFAULT_IMAGE, INGREDIENT_NAME, INGREDIENTS, STEPS_VALIDATION_RULES} from "./consts";
import IngredientFields from "./IngredientFields";
import FormField from "./FormField";
import StyledForm from "./styles";

function CreateEditRecipeDialog ({onClose, recipeData, open}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [submitInProgress, setSubmitInProgress] = useState(false);
  const dispatch = useDispatch();
  const handleClose = useCallback(() => onClose(), [onClose]);
  const onNewImageSelect = useCallback((newImage) => setSelectedImage(newImage), []);

  const { control, reset, handleSubmit } = useForm();
  const { errors } = useFormState({ control });
  const { fields, append, remove } = useFieldArray({ control, name: INGREDIENTS });

  const submitData = (data) => {
    const recipeDataToSubmit = {
      imageUrl: selectedImage || null,
      ...data,
      [INGREDIENTS]: data[INGREDIENTS]?.map(({[INGREDIENT_NAME]: ingredientName}) => ingredientName)
    };
    const submitDoneCallback = () => {
      setSubmitInProgress(false);
      handleClose();
    };
    const submitFailedCallback = () => setSubmitInProgress(false);

    setSubmitInProgress(true);
    if (recipeData?._id) {
      recipeDataToSubmit._id = recipeData?._id;
      dispatch(editRecipe(recipeDataToSubmit, submitDoneCallback, submitFailedCallback));
    } else {
      dispatch(createRecipe(recipeDataToSubmit, submitDoneCallback, submitFailedCallback));
    }
  }


  useEffect(() => {
    if (!open) {
      reset({ name: '', servings: '', time: '', steps: '', [INGREDIENTS]: [{ [INGREDIENT_NAME]: '' }] });
      setSelectedImage(null);
    }

    if (open && recipeData?._id) {
      const { name, servings, time, steps, [INGREDIENTS]: ingredients, imageUrl } = recipeData;
      reset({ name, servings, time, steps,
        [INGREDIENTS]: ingredients.map((ingredientName) => ({ [INGREDIENT_NAME]: ingredientName }))
      });
      setSelectedImage(imageUrl);
    }
  }, [open, recipeData?._id, recipeData]);

  return (
    <Dialog maxWidth={'lg'}
            onClose={() => !submitInProgress && onClose()}
            open={open}>
      <DialogTitle>Add new recipe</DialogTitle>
      <DialogContent>
        <StyledForm>
          <Typography variant={'h6'}>Add Image</Typography>
          <AddImage imageUrl={selectedImage} onImageLoaded={onNewImageSelect}/>
          <div className="short-inputs">
            <FormField name="name" label="Recipe name" errors={errors} control={control}/>
            <FormField name="servings" label="Nr. of servings (100g)" errors={errors} control={control}/>
            <FormField name="time" label="Cooking time" errors={errors} control={control}/>
          </div>

          <IngredientFields fields={fields} control={control} errors={errors} remove={remove}/>

          <Button variant="outlined" onClick={() => append({ [INGREDIENT_NAME]: '' })}>
            Add new ingredient
          </Button>

          <Controller name="steps"
                      control={control}
                      rules={STEPS_VALIDATION_RULES}
                      render={({ field }) =>
                        <TextField
                          label="Preparation steps"
                          variant="outlined"
                          sx={{mt: '35px'}}
                          rows='4'
                          multiline
                          fullWidth
                          {...field}
                          error={Boolean(errors.steps)}
                          helperText={errors.steps?.message}/>}
          />
        </StyledForm>
      </DialogContent>
      <DialogActions>
        {submitInProgress ? <CircularProgress/> : ''}
        <Button disabled={submitInProgress} onClick={handleClose}>Cancel</Button>
        <Button disabled={submitInProgress} autoFocus onClick={() => handleSubmit(submitData)()}>
          {recipeData?._id ? 'Edit recipe' : 'Create recipe'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateEditRecipeDialog;
