import { configureStore } from "@reduxjs/toolkit";
import { recipesSlice } from "./RecipesSlice";
import { errorAlertSlice } from "./errorAlertSlice";

export const store = configureStore({
  reducer: {
    recipes: recipesSlice.reducer,
    errorAlert: errorAlertSlice.reducer
  }
});
