import {StoreService} from "../services/StoreService";
import {useEffect, useState} from "react";
import {RecipeCard} from "../recipe-card/RecipeCard";
import CircularProgress from "@mui/material/CircularProgress";
import './RecipeCardsLayout.scss';
import {CreateRecipeDialog2} from "../create-recipe-dialog/CreateRecipeDialog";
import Button from "@mui/material/Button";

export function RecipeCardsLayout() {
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [recipes, setRecipes] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
    <div className="RecipeCardsLayout">
      <div className="button-wrap">
        <Button variant="contained"
                disabled={recipesLoading}
                onClick={() => setDialogOpen(true)}>
          Create new recipe
        </Button>
      </div>
      <div className={`cards ${recipes && !recipesLoading ? 'loaded' : 'isLoading'}`}>
        {recipes && !recipesLoading ? getRecipesView(recipes) : <CircularProgress/>}
      </div>
      <CreateRecipeDialog2 open={dialogOpen} onClose={() => setDialogOpen(false)}/>
    </div>
  );
}
