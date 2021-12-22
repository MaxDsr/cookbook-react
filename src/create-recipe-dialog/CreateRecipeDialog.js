import React, {useState} from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { AddImage } from '../add-file/AddImage';
import './CreateRecipeDialog.scss';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useFormik } from "formik";
import * as yup from 'yup';
import {StoreService} from "../services/StoreService";
import CircularProgress from "@mui/material/CircularProgress";

const validationSchema = yup.object({
  name: yup.string().required('Recipe name is required'),
  servings: yup.string().required('Please enter servings number'),
  time: yup.string().required('Please enter cooking time'),
  ingredients: yup.string().required('Please write down ingredients'),
  steps: yup.string().required('Please describe your cook steps')
});

const defaultImage = `https://st3.depositphotos.com/13324256/17303/i/1600/depositphotos_173034766-stock-photo-woman-writing-down-recipe.jpg`;

export const CreateRecipeDialog2 = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [submitInProgress, setSubmitInProgress] = useState(false);
  const handleClose = () => {
    props.onClose();
  };
  const onNewImageSelect = (newImage) => setSelectedImage(newImage);
  const imageUrl = null;
  const formik = useFormik({
    initialValues: {name: '', servings: '', time: '', steps: '', ingredients: ''},
    validationSchema: validationSchema,
    onSubmit: (values) => {
      StoreService.createRecipe({
        ...values,
        imageUrl: selectedImage || defaultImage,
        ingredients: values.ingredients.split('\n')
      }).then(() => {
        setSubmitInProgress(false);
        handleClose();
      });
      setSubmitInProgress(true);
    }
  });

  return (
    <Dialog className="CreateRecipeDialog"
            maxWidth={'lg'}
            onClose={props.onClose}
            open={props.open}>
      <DialogTitle>Add new recipe</DialogTitle>
      <DialogContent>
        <form className="content-wrap" onSubmit={formik.handleSubmit}>
          <Typography variant={'h6'}>Add Image</Typography>
          <AddImage imageUrl={imageUrl} onImageLoaded={onNewImageSelect}/>
          <div className="short-inputs">
            <TextField label="Recipe name"
                       id="name"
                       name="name"
                       variant="standard"
                       value={formik.values.name}
                       onChange={formik.handleChange}
                       error={formik.touched.name && Boolean(formik.errors.name)}
                       helperText={formik.touched.name && formik.errors.name}/>
            <TextField label="Nr. of servings (100g)"
                       id="servings"
                       name="servings"
                       variant="standard"
                       onChange={formik.handleChange}
                       value={formik.values.servings}
                       error={formik.touched.servings && Boolean(formik.errors.servings)}
                       helperText={formik.touched.servings && formik.errors.servings}/>
            <TextField label="Cooking time"
                       id="time"
                       name="time"
                       variant="standard"
                       onChange={formik.handleChange}
                       value={formik.values.time}
                       error={formik.touched.time && Boolean(formik.errors.time)}
                       helperText={formik.touched.time && formik.errors.time}/>
          </div>

          <TextField id="ingredients"
                     name="ingredients"
                     label={`Ingredients (separate them by pressing "Enter" button)`}
                     rows="4"
                     multiline
                     fullWidth
                     onChange={formik.handleChange}
                     value={formik.values.ingredients}
                     error={formik.touched.ingredients && Boolean(formik.errors.ingredients)}
                     helperText={formik.touched.ingredients && formik.errors.ingredients}/>

          <TextField
              id="steps"
              name="steps"
              label="Preparation steps"
              sx={{mt: '35px'}}
              rows='4'
              multiline
              fullWidth
              onChange={formik.handleChange}
              value={formik.values.steps}
              error={formik.touched.steps && Boolean(formik.errors.steps)}
              helperText={formik.touched.steps && formik.errors.steps}/>
        </form>
      </DialogContent>
      <DialogActions>
        {submitInProgress ? <CircularProgress/> : ''}
        <Button disabled={submitInProgress} onClick={handleClose}>Cancel</Button>
        <Button disabled={submitInProgress} autoFocus onClick={() => formik.submitForm()}>Create recipe</Button>
      </DialogActions>
    </Dialog>
  );
};
