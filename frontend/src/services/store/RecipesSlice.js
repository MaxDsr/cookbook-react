import { createSlice } from "@reduxjs/toolkit";
import { ApiService } from "../ApiService";
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
    ApiAxiosService.get('recipes').then((recipesResponse) => {
      dispatch(setRecipesRd(recipesResponse.data));
      dispatchDoneCallback && dispatchDoneCallback();
    });
  }
};

export const createRecipe = (recipe, dispatchDoneCallback, dispatchFailedCallback) => {
  return (dispatch) => {
    ApiService.createRecipeAPI(recipe).then(
        () => setRecipes(dispatchDoneCallback)(dispatch),
        (error) => {
          dispatch(setErrorAlert(error));
          dispatchFailedCallback();
        }
    );
  };
};

export const editRecipe = (recipe, dispatchDoneCallback, dispatchFailedCallback) => {
  return (dispatch) => {
    ApiService.editRecipeAPI(recipe).then(
        () => setRecipes(dispatchDoneCallback)(dispatch),
        (error) => {
          dispatch(setErrorAlert(error));
          dispatchFailedCallback();
        }
    );
  }
};

export const deleteRecipe = (recipeId, dispatchDoneCallback) => {
  return (dispatch) => {
    ApiService.deleteRecipeAPI(recipeId).then(
      (isDeleted) => {
        if (isDeleted) {
          setRecipes(dispatchDoneCallback)(dispatch);
        }
      },
      (errorMessage) => {
        dispatch(setErrorAlert(errorMessage));
        dispatchDoneCallback && dispatchDoneCallback();
      }
    );
  };
};
