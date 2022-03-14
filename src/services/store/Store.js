import { configureStore } from "@reduxjs/toolkit";
import { recipesSlice } from "./RecipesSlice";

export const store = configureStore({
  reducer: {
    recipes: recipesSlice.reducer
  }
});
