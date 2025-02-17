import { createSlice } from "@reduxjs/toolkit";
import { setErrorAlert } from "./errorAlertSlice";
import ApiAxiosService from "../ApiAxiosService.js";

export const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    value: [],
  },
  reducers: {
    setRecipesRd: (state, action) => {
      state.value = action.payload;
    }
  }
});

const { setRecipesRd } = recipesSlice.actions;

export const setRecipes = (dispatchDoneCallback) => {
  return (dispatch) => {
    ApiAxiosService.get('recipes').then(
      (recipesResponse) => {
        dispatch(setRecipesRd(recipesResponse.data));
        dispatchDoneCallback && dispatchDoneCallback();
      },
      (error) => {
        dispatch(setErrorAlert(error.message));
      }
    );
  }
};

export const createRecipe = (recipe, dispatchDoneCallback, dispatchFailedCallback) => {
  return (dispatch) => {
    ApiAxiosService.post('/recipes/create', recipe).then(
        () => setRecipes(dispatchDoneCallback)(dispatch),
        (error) => {
          dispatch(setErrorAlert(error.message));
          dispatchFailedCallback();
        }
    );
  };
};

export const editRecipe = (recipe, dispatchDoneCallback, dispatchFailedCallback) => {
  return (dispatch) => {
    ApiAxiosService.put(`/recipes/edit/${recipe._id}`, {...recipe}).then(
      () => setRecipes(dispatchDoneCallback)(dispatch),
      (error) => {
        dispatch(setErrorAlert(error));
        dispatchFailedCallback();
      }
    )
  }
};

export const deleteRecipe = (recipeId, dispatchDoneCallback) => {
  return (dispatch) => {
    ApiAxiosService.delete(`/recipes/delete/${recipeId}`).then(
      () => setRecipes(dispatchDoneCallback)(dispatch),
      (error) => {
        dispatch(setErrorAlert(error.message));
        dispatchDoneCallback && dispatchDoneCallback();
      }
    );
  };
};
