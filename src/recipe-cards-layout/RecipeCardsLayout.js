import {StoreService} from "../services/StoreService";
import {useEffect, useState} from "react";
import {RecipeCard} from "../recipe-card/RecipeCard";
import CircularProgress from "@mui/material/CircularProgress";
import './RecipeCardsLayout.scss';

export function RecipeCardsLayout() {
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [recipes, setRecipes] = useState(null);

  useEffect(() => {
    const unsubscribeFromStore = StoreService.storeSubscribe(() => {
      const recipes = StoreService.getStoreState()?.recipes;
      if (recipes.hasChanges) {
        setRecipes(recipes.data);
        setRecipesLoading(false);
      }
    });
    StoreService.fetchRecipes();
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
