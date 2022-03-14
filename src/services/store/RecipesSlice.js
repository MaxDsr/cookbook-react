import { createSlice } from "@reduxjs/toolkit";
import { ApiService } from "../ApiService";
import { setErrorAlert } from "./errorAlertSlice";

export const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    value: [],
  },
  reducers: {
    setRecipesRd: (state, action) => {
      state.value = action.payload;
    },
    createRecipeRd: (state, action) => {
      state.value.push(action.payload);
    },
    deleteRecipeRd: (state, action) => {
      state.value.splice(action.payload, 1);
    }
  }
});

const { setRecipesRd, createRecipeRd, deleteRecipeRd } = recipesSlice.actions;

export const setRecipes = (dispatchDoneCallback) => {
  return (dispatch, getState) => {
    ApiService.getRecipesAPI().then((recipes) => {
      dispatch(setRecipesRd(recipes));
      dispatchDoneCallback();
    });
  }
};

export const createRecipe = (recipe, dispatchDoneCallback) => {
  return (dispatch) => {
    ApiService.createRecipeAPI(recipe).then((newRecipeId) => {
      dispatch(createRecipeRd({ ...recipe, id: newRecipeId }));
      dispatchDoneCallback && dispatchDoneCallback();
    });
  };
};

export const deleteRecipe = (recipeId) => {
  return (dispatch, getState) => {
    ApiService.deleteRecipeAPI(recipeId).then(
      (isDeleted) => {
        if (isDeleted) {
          const deletedRecipe = getState().recipes.value.find((recipe) => recipe.id === recipeId);
          //TODO if deletedRecipe === undefined do smth..
          dispatch(deleteRecipeRd(deletedRecipe));
        }
      },
      (errorMessage) => {
        dispatch(setErrorAlert(errorMessage));
      }
    );
  };
};
