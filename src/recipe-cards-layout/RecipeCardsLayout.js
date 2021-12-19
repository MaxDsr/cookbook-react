import {ApiService} from "../api-service/ApiService";
import {useEffect, useState} from "react";
import {RecipeCard} from "../recipe-card/RecipeCard";
import CircularProgress from "@mui/material/CircularProgress";
import './RecipeCardsLayout.scss';

export function RecipeCardsLayout() {
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [recipes, setRecipes] = useState(null);

  const store = ApiService.getStore;

  useEffect(() => {
    const unsubscribeFromStore = store.subscribe(() => {
      const recipes = store.getState()?.recipes;
      if (recipes) {
        setRecipes(recipes);
        setRecipesLoading(false);
      }
    });
    ApiService.fetchRecipesFromAPI();
    return () => {
      unsubscribeFromStore();
    }
  }, []);

  const getRecipesView = (recipes) =>
    recipes.map((recipeCardData) =>
      <RecipeCard key={'RecipeCard' + recipeCardData.id} cardData={recipeCardData}/>);

  return (
    <div className={`RecipeCardsLayout ${recipes && !recipesLoading ? 'loaded' : 'isLoading'}`}>
      {recipes && !recipesLoading ? getRecipesView(recipes) : <CircularProgress/>}
    </div>
  );
}
